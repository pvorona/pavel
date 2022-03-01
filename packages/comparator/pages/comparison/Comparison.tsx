import { ComparisonTable } from './ComparisonTable'

export function Main() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ComparisonTable />
    </div>
  )
}

export default function Comparison() {
  return (
    <div className="h-full flex flex-col dark:bg-[#202124] dark:text-[#e7eaed]">
      {/* <Header /> */}
      <Main />
    </div>
  )
}
