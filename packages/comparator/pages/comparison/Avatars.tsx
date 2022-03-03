import { Avatar } from '../../shared'

const avatars = [{ id: 'avatar 1' }, { id: 'avatar 2' }]

export function Avatars() {
  return (
    <div className="mx-2 flex items-center">
      {avatars.map(avatar => (
        <Avatar key={avatar.id} />
      ))}
    </div>
  )
}
