import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "users.json");

interface User {
  name: string;
  email: string;
  password: string;
  role?: string;
}

async function getUsers(): Promise<User[]> {
  try {
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users.map(({ password, ...u }) => u));
}

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "email и password обязательны" }, { status: 400 });
  }

  const users = await getUsers();
  if (users.some(u => u.email === email)) {
    return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
  }

  users.push({ name, email, password, role: role || "user" });
  await saveUsers(users);

  return NextResponse.json({ success: true });
}
