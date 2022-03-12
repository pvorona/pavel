import {
  Button,
  Input,
  VALIDITY,
  IconButton,
  IconEyeClosed,
  IconEyeOpen,
} from '@pavel/components'
import React, { useCallback, useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import {
  useAutoFocus,
  usePointerProximity,
  useStorage,
} from '@pavel/react-utils'
import { isBrowser } from '@pavel/utils'

type FormValues = { email: string; password: string }

function validate(values: FormValues) {
  const errors = {} as FormValues
  if (!values.email) {
    errors.email = 'Please enter email address'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Please enter real email address'
  }

  if (!values.password) {
    errors.password = 'Please enter password'
  } else if (values.password.length < 6) {
    errors.password = 'Password should be at least 6 characters long'
  }
  return errors
}

export function EmailPasswordForm({
  onSubmit,
  title,
  hint,
  buttonLabel,
  buttonLoadingLabel,
}: {
  title: string
  hint: string
  buttonLabel: string
  buttonLoadingLabel: string
  onSubmit: (formValue: { email: string; password: string }) => Promise<unknown>
}) {
  const emailInputRef = useAutoFocus()
  const [isCloseToButton, buttonRef] = usePointerProximity()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [storedEmail, setStoredEmail, removeStoredEmail] = useStorage({
    key: 'email',
    initialValue: '',
    storage: isBrowser && sessionStorage,
  })
  const ownOnSubmit = useCallback(
    async (
      values: FormValues,
      { setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      try {
        await onSubmit(values)
        removeStoredEmail()
      } catch (e) {
        // Hack
        setFieldError('email', 'Email')
        setFieldError('password', 'Password')
        console.error(e)
      } finally {
        setSubmitting(false)
      }
    },
    [onSubmit, removeStoredEmail],
  )
  const initialValues = { email: storedEmail, password: '' }
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues,
    initialErrors: validate(initialValues),
    validate,
    onSubmit: ownOnSubmit,
  })

  useEffect(() => {
    setStoredEmail(values.email)
  }, [values, setStoredEmail])

  function togglePasswordVisible() {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const emailValidity =
    errors.email && ((touched.email && dirty) || isCloseToButton)
      ? VALIDITY.INVALID
      : VALIDITY.DEFAULT
  const passwordValidity =
    errors.password && ((touched.password && dirty) || isCloseToButton)
      ? VALIDITY.INVALID
      : VALIDITY.DEFAULT

  return (
    <>
      <div className="text-3xl font-bold mt-28">{title}</div>
      <div className="text-sm mt-6 tracking-wide text-gray-1">{hint}</div>
      <form onSubmit={handleSubmit} className="mt-6">
        <Input
          name="email"
          className="block"
          placeholder={
            errors.email && touched.email && dirty
              ? String(errors.email)
              : 'Email'
          }
          autoCapitalize="false"
          autoComplete="off"
          autoCorrect="false"
          ref={emailInputRef}
          onBlur={handleBlur}
          value={values.email}
          onInput={handleChange}
          validity={emailValidity}
        />
        <Input
          className="block mt-4"
          placeholder={
            errors.password && touched.password && dirty
              ? errors.password
              : 'Password'
          }
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          onInput={handleChange}
          onBlur={handleBlur}
          value={values.password}
          icon={
            <IconButton onClick={togglePasswordVisible}>
              {isPasswordVisible ? <IconEyeClosed /> : <IconEyeOpen />}
            </IconButton>
          }
          validity={passwordValidity}
        />
        {/* loading cursor wait */}
        <Button
          ref={buttonRef}
          className="w-full mt-8"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? buttonLoadingLabel : buttonLabel}
        </Button>
      </form>
    </>
  )
}
