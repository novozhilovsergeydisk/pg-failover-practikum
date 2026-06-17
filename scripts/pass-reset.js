#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://appuse.ru";

async function resetPassword() {
  const args = process.argv.slice(2);
  const email = args[0];
  const newPassword = args[1];

  if (!email || !newPassword) {
    console.error("Использование: npm run pass:reset <email> <новый_пароль>");
    console.error("Пример: npm run pass:reset admin@koderstudio.ru mypassword123");
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error("Пароль должен быть не менее 6 символов");
    process.exit(1);
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Ошибка: ${data.error}`);
      process.exit(1);
    }

    console.log(`✓ Пароль для ${email} успешно обновлён`);
  } catch (error) {
    console.error(`Ошибка подключения к ${BASE_URL}`);
    process.exit(1);
  }
}

resetPassword();
