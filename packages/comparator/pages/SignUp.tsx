import { auth } from '@pavel/comparator-shared'
import { Button } from '@pavel/components'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { EmailPasswordForm, SignInLayout } from '../modules'

export default function SignUpPage() {
  return (
    <SignInLayout>
      <SignUpForm />
    </SignInLayout>
  )
}

function SignUpForm() {
  function onSubmit({ email, password }: { email: string; password: string }) {
    console.log('sign up', { email, password })

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        console.log({ userCredential, user })
      })
      .catch(error => {
        console.log(error)
      })
  }

  return <EmailPasswordForm onSubmit={onSubmit} label="Sign up" />
}
