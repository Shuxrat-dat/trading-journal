'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    await signIn('credentials', {
      username,
      password,
      callbackUrl: '/',
    })
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="tv-card p-6">
        <h1 className="text-xl font-bold mb-6">
          Вход в Trading Journal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-3 rounded"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}