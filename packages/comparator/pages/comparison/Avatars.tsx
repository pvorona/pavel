import { Avatar } from '../../common'
import { avatars } from './Comparison.data'

export function Avatars() {
  return (
    <div className="mx-2 flex items-center">
      {avatars.map(avatar => (
        <Avatar key={avatar.id} />
      ))}
    </div>
  )
}
