import { Button, Input } from '@pavel/components'
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
      <Input
        className="block"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        className="block mt-4"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button className="mt-8 w-full" buttonType="submit">
        {label}
      </Button>
    </form>
  )
}
