import { Button, Input } from '@pavel/components'
import classNames from 'classnames'
import { useState } from 'react'

export function EmailPasswordForm({
  onSubmit,
  title,
  hint,
  buttonLabel,
}: {
  title: string
  hint: string
  buttonLabel: string
  onSubmit: (formValue: { email: string; password: string }) => Promise<unknown>
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function ownOnSubmit(event: React.FormEvent) {
    event.preventDefault()

    setIsLoading(true)

    try {
      await onSubmit({ email, password })
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonVisible = email && password

  return (
    <>
      <div className="text-3xl font-bold mt-12">{title}</div>
      <div className="text-sm mt-6 text-gray-1">{hint}</div>
      <form onSubmit={ownOnSubmit} className="mt-9">
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
        <Button
          className={classNames(
            'mt-8 w-full opacity-0 transition-opacity duration-200',
            isButtonVisible && 'opacity-100',
          )}
          buttonType="submit"
          disabled={isLoading || !isButtonVisible}
        >
          {buttonLabel}
        </Button>
      </form>
    </>
  )
}
