import { SVGProps } from 'react'

// dark colors
export const IconButton = ({
  onClick,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button
    onClick={onClick}
    type="button"
    className="text-gray-1 hover:text-gray-6 focus:text-gray-6 transition-colors cursor-pointer outline-none"
  >
    <svg width={24} height={24} {...props} />
  </button>
)
