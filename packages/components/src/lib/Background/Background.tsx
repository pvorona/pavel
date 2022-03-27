import styles from './Background.module.scss'

export const Background = () => {
  return (
    <svg
      width="1728"
      height="2234"
      viewBox="50 0 1728 2234"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles['Background']}
      preserveAspectRatio="xMidYMin slice"
    >
      <circle cx="1510" cy="358" r="290" stroke="var(--background-color)" />

      <circle cx={0} cy={337} r={650} stroke="var(--background-color)" />
      <circle
        cx={200}
        cy={337 + 650 + 50}
        className={styles['Planets2']}
        transform-origin="0px 337px"
        r={30}
        fill="var(--fill)"
      />

      <circle cx="1321" cy="1349" r="628.5" stroke="var(--background-color)" />

      <circle cx="1232" cy="-119" r="195.5" stroke="var(--background-color)" />
      <circle cx="1054.5" cy="198.5" r="70" stroke="var(--background-color)" />
      <circle
        className={styles['Planets1']}
        transform-origin="1054.5px 198.5px"
        cx="952"
        cy="238"
        r="18"
        fill="var(--fill)"
      />
      <circle
        className={styles['Planets1']}
        transform-origin="1054.5px 198.5px"
        cx="1168"
        cy="202"
        r="18"
        fill="var(--fill)"
      />
      <circle cx="522" cy="1184" r="151.5" stroke="var(--background-color)" />
      <circle cx="-24.5" cy="1510.5" r="360" stroke="var(--background-color)" />
      <circle cx="648.5" cy="2490.5" r="672" stroke="var(--background-color)" />
      <circle cx="1801" cy="-152" r="252.5" stroke="var(--background-color)" />
    </svg>
  )
}
