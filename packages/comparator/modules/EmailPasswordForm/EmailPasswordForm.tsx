import { Button } from '@pavel/components'
import { useState } from 'react'

export function EmailPasswordForm({
  onSubmit,
  label,
}: {
  label: string
  onSubmit: (formValue: { email: string; password: string }) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function ownOnSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={ownOnSubmit}>
      <input
        className="block"
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="block"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button type="submit">{label}</Button>
    </form>
  )
}
