import { IoRemove } from 'react-icons/io5'
import { Button } from '~shared/ui/button'
import { profileTypes } from '~entities/profile'
import { useUnfollowProfileMutation } from './unfollow-profile.mutation'

export function UnfollowUserButton(props: { profile: profileTypes.Profile }) {
  const { profile } = props

  const { mutate } = useUnfollowProfileMutation({
    mutationKey: [profile.username],
  })

  const handleClick = () => {
    const unfollowedProfile = unfollow(profile)
    mutate(unfollowedProfile)
  }

  return (
    <Button
      color="secondary"
      className="action-btn "
      onClick={handleClick}
    >
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  )
}

function unfollow(profile: profileTypes.Profile): profileTypes.Profile {
  return {
    ...profile,
    following: false,
  }
}
