import classNames from 'classnames'
import { forwardRef, InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  icon?: JSX.Element
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, placeholder, icon, ...props },
  ref,
) {
  return (
    <div className={classNames('relative', styles['container'])}>
      <input
        ref={ref}
        className={classNames(
          'outline-none rounded border-none overflow-ellipsis',
          className,
          styles['input'],
          icon && 'pr-10',
        )}
        placeholder=" "
        type="text"
        {...props}
      />
      <div className={styles['placeholder']}>{placeholder}</div>
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex">
          {icon}
        </div>
      )}
    </div>
  )
})
