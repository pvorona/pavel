import classNames from 'classnames'
import { forwardRef, InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, placeholder, ...props }: InputProps,
  ref,
) {
  return (
    <div className={classNames('relative', styles['container'])}>
      <input
        ref={ref}
        className={classNames(
          'outline-none rounded border-none ',
          className,
          styles['input'],
        )}
        placeholder=" "
        type="text"
        {...props}
      />
      <div className={styles['placeholder']}>{placeholder}</div>
    </div>
  )
})
