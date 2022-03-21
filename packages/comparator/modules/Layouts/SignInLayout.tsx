import { Background } from '../../pages/Background'

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
