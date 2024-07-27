import { IoAdd } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { profileTypes } from '~entities/profile'
import { useFollowProfileMutation } from './follow-profile.mutation'

export function FollowUserButton(props: { profile: profileTypes.Profile }) {
  const { profile } = props

  const { mutate } = useFollowProfileMutation({
    mutationKey: [profile.username],
  })

  const handleClick = () => {
    const followedProfile = follow(profile)
    mutate(followedProfile)
  }

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn "
      onClick={handleClick}
    >
      <IoAdd size={16} />
      &nbsp; Follow {profile.username}
    </Button>
  )
}

function follow(profile: profileTypes.Profile): profileTypes.Profile {
  return {
    ...profile,
    following: true,
  }
}
