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
  useOnUnload,
  usePointerProximity,
} from '@pavel/react-utils'
import {
  bindStorage,
  getFromStorage,
  isBrowser,
  moveCursorToEnd,
} from '@pavel/utils'
import { LoadingStatus } from '@pavel/types'
import { useRouter } from 'next/router'
import { SIGN_IN, SIGN_UP } from '@pavel/comparator-shared'

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

const storageKey = 'email'
const storage = isBrowser && sessionStorage

const { remove: removeEmailFromStorage, set: saveEmailToStorage } = bindStorage(
  {
    storage,
    key: storageKey,
  },
)

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
  const router = useRouter()

  useOnUnload(() => {
    console.log('removing because unload')
    removeEmailFromStorage()
  })

  useEffect(() => {
    function clearEmailIfNeeded(path: string) {
      if (![SIGN_UP, SIGN_IN].includes(path)) {
        console.log('removing because moved to', path)
        removeEmailFromStorage()
      }
    }

    router.events.on('routeChangeStart', clearEmailIfNeeded)

    return () => {
      router.events.off('routeChangeStart', clearEmailIfNeeded)
    }
  }, [router])

  const [emailInput, setEmailInput] = useState<HTMLInputElement | undefined>()
  const [isCloseToButton, buttonRef] = usePointerProximity()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const ownOnSubmit = useCallback(
    async (
      values: FormValues,
      { setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      try {
        await onSubmit(values)
        removeEmailFromStorage()
      } catch (e) {
        // Hack
        setFieldError('email', 'Email')
        setFieldError('password', 'Password')
        console.error(e)
      } finally {
        setSubmitting(false)
      }
    },
    [onSubmit],
  )
  const initialValues = {
    email: getFromStorage(storageKey, '', storage),
    password: '',
  }
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

  useAutoFocus(emailInput)

  useEffect(() => {
    saveEmailToStorage(values.email)
  }, [values])

  useEffect(() => {
    if (emailInput) {
      moveCursorToEnd(emailInput)
    }
  }, [emailInput])

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
      <div className="text-sm mt-5 tracking-wide text-gray-1">{hint}</div>
      <form onSubmit={handleSubmit} className="mt-6">
        <Input
          name="email"
          className="block"
          placeholder={
            errors.email && touched.email && dirty
              ? String(errors.email)
              : 'Email'
          }
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          ref={setEmailInput}
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
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
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
        {/* TODO: loading cursor wait */}
        <Button
          ref={buttonRef}
          className="w-full mt-8"
          disabled={isSubmitting || !isValid}
          loadingStatus={
            isSubmitting ? LoadingStatus.IN_PROGRESS : LoadingStatus.IDLE
          }
        >
          {isSubmitting ? buttonLoadingLabel : buttonLabel}
        </Button>
      </form>
    </>
  )
}
