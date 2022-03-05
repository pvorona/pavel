import { OptionObserver } from './OptionObserver'

export function OptionsObserver({ optionIds }: { optionIds: string[] }) {
  return (
    <>
      {optionIds.map(optionId => (
        <OptionObserver key={optionId} optionId={optionId} />
      ))}
    </>
  )
}
