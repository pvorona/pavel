import classNames from 'classnames'
import styles from './Background.module.scss'

export const Background = ({ animate }: { animate?: boolean }) => {
  return (
    <svg
      width="1728"
      height="2234"
      viewBox="50 0 1728 2234"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(styles['Background'], {
        [styles['WithFade']]: animate,
      })}
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <linearGradient id="gradient-1" x1="0" y1="0" x2="90%" y2="80%">
          <stop className={styles['Stop1']} offset="95%" stopOpacity={0} />
          <stop className={styles['Stop2']} offset="100%" />
        </linearGradient>

        <linearGradient id="gradient-2" x1="0" y1="100%" x2="0" y2="0">
          <stop className={styles['Stop1']} offset="85%" stopOpacity={0} />
          <stop className={styles['Stop2']} offset="100%" />
        </linearGradient>

        <linearGradient id="gradient-3" x1="0" y1="0" x2="0" y2="100%">
          <stop className={styles['Stop1']} offset="75%" stopOpacity={0} />
          <stop className={styles['Stop2']} offset="100%" />
        </linearGradient>
      </defs>
      <circle cx="1510" cy="358" r="290" className={styles['Gradient-3']} />

      <circle cx={0} cy={337} r={650} className={styles['Gradient-1']} />
      <circle
        cx={200}
        cy={337 + 650 + 50}
        className={styles['Planets2']}
        transform-origin="0px 337px"
        r={30}
        fill="var(--fill)"
      />

      <circle cx="1321" cy="1349" r="628.5" className={styles['Gradient-2']} />

      <circle
        className="dark:hidden"
        cx="1232"
        cy="-119"
        r="195.5"
        stroke="var(--background-color)"
      />
      <circle
        className="dark:hidden"
        cx="1054.5"
        cy="198.5"
        r="70"
        stroke="var(--background-color)"
      />
      <circle
        className={classNames(styles['Planets1'], 'dark:hidden')}
        transform-origin="1054.5px 198.5px"
        cx="952"
        cy="238"
        r="18"
        fill="var(--fill)"
      />
      <circle
        className={classNames(styles['Planets1'], 'dark:hidden')}
        transform-origin="1054.5px 198.5px"
        cx="1168"
        cy="202"
        r="18"
        fill="var(--fill)"
      />
      <circle cx="522" cy="1184" r="151.5" stroke="var(--background-color)" />
      <circle cx="-24.5" cy="1510.5" r="360" stroke="var(--background-color)" />
      <circle cx="648.5" cy="2490.5" r="672" stroke="var(--background-color)" />
      <circle
        className="dark:hidden"
        cx="1801"
        cy="-152"
        r="252.5"
        stroke="var(--background-color)"
      />
    </svg>
  )
}
