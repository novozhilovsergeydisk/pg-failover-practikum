import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "data", "users.json");

async function getUsers() {
  try {
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: unknown[]) {
  const { mkdir } = await import("fs/promises");
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  const { email, newPassword } = await request.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { error: "email и newPassword обязательны" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен быть не менее 6 символов" },
      { status: 400 }
    );
  }

  const users = await getUsers();
  const userIndex = users.findIndex((u: { email: string }) => u.email === email);

  if (userIndex === -1) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  users[userIndex] = { ...users[userIndex], password: newPassword };
  await saveUsers(users);

  return NextResponse.json({
    success: true,
    message: `Пароль для ${email} обновлён`,
  });
}
