import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

async function getGitHubAccessToken(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || "Failed to get access token");
  }
  return data.access_token;
}

async function getGitHubUser(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub user");
  }
  return res.json();
}

async function getGitHubEmails(accessToken: string) {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/login?error=${error || "github_auth_failed"}`, request.url)
    );
  }

  try {
    const accessToken = await getGitHubAccessToken(code);
    const githubUser = await getGitHubUser(accessToken);
    const emails = await getGitHubEmails(accessToken);

    const primaryEmail = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified)?.email
      || emails.find((e: { verified: boolean }) => e.verified)?.email
      || githubUser.email;

    if (!primaryEmail) {
      return NextResponse.redirect(
        new URL("/login?error=no_email", request.url)
      );
    }

    const githubId = String(githubUser.id);
    const githubLogin = githubUser.login;
    const avatarUrl = githubUser.avatar_url;
    const name = githubUser.name || githubLogin;

    let result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE github_id = $1",
      [githubId]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        "SELECT id, name, email, role FROM users WHERE email = $1",
        [primaryEmail]
      );

      if (result.rows.length > 0) {
        await pool.query(
          "UPDATE users SET github_id = $1, github_login = $2, avatar_url = $3 WHERE email = $4",
          [githubId, githubLogin, avatarUrl, primaryEmail]
        );
        result = await pool.query(
          "SELECT name, email, role FROM users WHERE email = $1",
          [primaryEmail]
        );
      } else {
        await pool.query(
          "INSERT INTO users (name, email, github_id, github_login, avatar_url, role) VALUES ($1, $2, $3, $4, $5, 'user')",
          [name, primaryEmail, githubId, githubLogin, avatarUrl]
        );
        result = await pool.query(
          "SELECT name, email, role FROM users WHERE github_id = $1",
          [githubId]
        );
      }
    }

    const user = result.rows[0];
    const token = signToken({
      name: user.name,
      email: user.email,
      role: user.role || "user",
    }, true);

    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("github_token", token);
    redirectUrl.searchParams.set("github_user", JSON.stringify({
      name: user.name,
      email: user.email,
      role: user.role || "user",
      avatar: avatarUrl,
    }));

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return NextResponse.redirect(
      new URL("/login?error=github_auth_failed", request.url)
    );
  }
}
