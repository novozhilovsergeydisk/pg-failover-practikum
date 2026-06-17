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

export async function POST(request: Request) {
  const { action, name, email, password } = await request.json();

  if (action === "register") {
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль минимум 6 символов" }, { status: 400 });
    }

    const users = await getUsers();
    if (users.some(u => u.email === email)) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
    }

    users.push({ name, email, password, role: "user" });
    await saveUsers(users);
    return NextResponse.json({ success: true, user: { name, email, role: "user" } });
  }

  if (action === "login") {
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role || "user" },
    });
  }

  return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
}
