import { Background } from '@pavel/components'

export function SignInLayout(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) {
  return (
    <>
      <Background />
      <div
        className="flex flex-col items-center justify-center h-screen"
        {...props}
      />
    </>
  )
}
