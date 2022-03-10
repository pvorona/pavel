import classNames from 'classnames'
import { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

export function Input({
  className,
  placeholder,
  ...props
}: React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <div className={classNames('relative', styles['container'])}>
      <input
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
}
