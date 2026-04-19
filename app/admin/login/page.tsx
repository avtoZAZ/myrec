export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Вход в админку</h1>
      <form action="/api/auth/login" method="post" className="mt-6 space-y-3 rounded-3xl bg-white p-6 shadow">
        <input name="username" placeholder="Логин" className="w-full rounded-xl border px-3 py-2" required />
        <input name="password" placeholder="Пароль" type="password" className="w-full rounded-xl border px-3 py-2" required />
        <button className="w-full rounded-xl bg-espresso py-2 text-white">Войти</button>
      </form>
      <p className="mt-3 text-xs text-espresso/60">По умолчанию после seed: admin / admin123</p>
    </main>
  );
}
