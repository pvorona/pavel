import classNames from 'classnames'
import { forwardRef, InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  icon?: JSX.Element
  hint?: string
  validity?: VALIDITY
}

export enum VALIDITY {
  DEFAULT,
  VALID,
  INVALID,
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, placeholder, icon, hint, validity = VALIDITY.DEFAULT, ...props },
  ref,
) {
  return (
    <div className={classNames('relative', styles['container'])}>
      <input
        ref={ref}
        className={classNames(
          'outline-none rounded border-none overflow-ellipsis peer',
          className,
          styles['input'],
          {
            'pr-10': icon,
            [styles['invalid']]: validity === VALIDITY.INVALID,
          },
        )}
        placeholder=" "
        type="text"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        {...props}
      />
      {hint && (
        <div
          className={classNames(styles['hint'], 'tracking-wider text-red-400')}
        >
          {hint}
        </div>
      )}
      {placeholder && (
        <div className={classNames(styles['placeholder'], '')}>
          {placeholder}
        </div>
      )}
      {icon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex">
          {icon}
        </div>
      )}
    </div>
  )
})
