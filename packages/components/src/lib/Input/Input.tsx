import classNames from 'classnames'
import { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

// outline: none;
// font-size: var(--font-size-12);
// padding: var(--space-vertical-18) var(--space-horizontal-15);
// border-radius: 10px;
// border: none;
// box-shadow: 0 0 0 var(--border-width) var(--color-grey-3) inset;
// width: 360px;
// caret-color: var(--color-blue-1);
// transition: box-shadow var(--time-transition-duration);

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
