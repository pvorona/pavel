import { Button, Input, VALIDITY } from '@pavel/components'
import React, { SVGProps, useCallback, useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { useStorage } from '@pavel/comparator-shared'
import { getDistanceBetweenPointAndRectangle, isBrowser } from '@pavel/utils'
import { observe, pointerPosition } from '@pavel/observable'

const IconContainer = ({
  onClick,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button
    onClick={onClick}
    type="button"
    className="text-gray-1 hover:text-gray-6 focus:text-gray-6 transition-colors cursor-pointer outline-none"
  >
    <svg width={24} height={24} {...props} />
  </button>
)

const IconEyeOpen = () => (
  <path
    fill="currentColor"
    fillRule="nonzero"
    d="M12.0037244,5.5 C17.8510242,5.5 22,10.459316 22,12 C22,13.540684 17.8733706,18.5 12.0037244,18.5 C6.17877095,18.5 2,13.540684 2,12 C2,10.459316 6.20856611,5.5 12.0037244,5.5 Z M12,8 C9.790861,8 8,9.790861 8,12 C8,14.209139 9.790861,16 12,16 C14.209139,16 16,14.209139 16,12 C16,9.790861 14.209139,8 12,8 Z M12,10.5 C12.8284271,10.5 13.5,11.1715729 13.5,12 C13.5,12.8284271 12.8284271,13.5 12,13.5 C11.1715729,13.5 10.5,12.8284271 10.5,12 C10.5,11.1715729 11.1715729,10.5 12,10.5 Z"
  />
)

const IconEyeClosed = () => (
  <path
    fill="currentColor"
    fillRule="nonzero"
    d="M3.24742331,4.34149539 C3.58312982,3.95783081 4.14726,3.89243104 4.5589723,4.17068553 L4.65850461,4.24742331 L20.6585046,18.2474233 C21.0741412,18.6111054 21.1162587,19.242868 20.7525767,19.6585046 C20.4168702,20.0421692 19.85274,20.107569 19.4410277,19.8293145 L19.3414954,19.7525767 L16.678014,17.4222694 C15.3119739,18.0692771 13.7335408,18.5 12.0037244,18.5 C6.17877095,18.5 2,13.540684 2,12 C2,11.1350242 3.32652339,9.19250915 5.51558991,7.65500291 L3.34149539,5.75257669 C2.92585876,5.38889464 2.88374125,4.75713202 3.24742331,4.34149539 Z M8,12 C8,14.209139 9.790861,16 12,16 C12.836931,16 13.6138279,15.7429633 14.2560564,15.3035242 L12.1815054,13.4891302 C12.1220062,13.4963068 12.0614344,13.5 12,13.5 C11.1773258,13.5 10.509335,12.8377221 10.500097,12.017236 L8.42584708,10.2021204 C8.15342141,10.7426353 8,11.3534009 8,12 Z M12.0037244,5.5 C17.8510242,5.5 22,10.459316 22,12 C22,12.6358131 21.2972072,13.8538424 20.059148,15.0652638 L15.9670652,11.4843103 C15.7225066,9.58427469 14.1447921,8.10174686 12.2022178,8.00502282 L11.984,8 L9.48427708,5.81332663 C10.2814494,5.61420081 11.1243193,5.5 12.0037244,5.5 Z"
  />
)

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
  const [emailElement, setEmailElement] = useState<HTMLInputElement>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [storedEmail, setStoredEmail, removeStoredEmail] = useStorage({
    key: 'email',
    initialValue: '',
    storage: isBrowser && sessionStorage,
  })
  const [isCloseToButton, setIsCloseToButton] = useState(false)
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

  useEffect(() => {
    const THRESHOLD = 20

    return observe(
      [pointerPosition],
      ({ x, y }) => {
        const button = document.getElementById('kek')
        const { left, top, right, bottom } = button.getBoundingClientRect()

        const distance = getDistanceBetweenPointAndRectangle([x, y], {
          left,
          top,
          right,
          bottom,
        })
        setIsCloseToButton(distance < THRESHOLD)
      },
      { fireImmediately: false },
    )
  }, [])

  useEffect(() => {
    if (emailElement) {
      emailElement.focus()
    }
  }, [emailElement])

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
          ref={setEmailElement}
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
            <IconContainer onClick={togglePasswordVisible}>
              {isPasswordVisible ? <IconEyeClosed /> : <IconEyeOpen />}
            </IconContainer>
          }
          validity={passwordValidity}
        />
        <Button
          id="kek"
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
