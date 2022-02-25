import { ComparisonTable } from './ComparisonTable'
import { Header } from './Header'

export function Main() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ComparisonTable />
    </div>
  )
}

export default function Comparison() {
  return (
    <div className="h-full flex flex-col dark:bg-dark-1 dark:text-dark-text">
      <Header />
      <Main />
    </div>
  )
}
