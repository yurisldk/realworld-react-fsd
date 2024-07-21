import { useNavigate } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { useSessionStore } from '~shared/session'
import { useLogoutMutation } from './logout.mutation'

export function LogoutButton() {
  const navigate = useNavigate()

  const { mutate } = useLogoutMutation({
    onSuccess: () => {
      useSessionStore.getState().resetSession()
      navigate(pathKeys.home())
    },
  })

  const handleClick = () => {
    mutate()
  }

  return (
    <button
      className="btn btn-outline-danger"
      type="button"
      onClick={handleClick}
    >
      Or click here to logout.
    </button>
  )
}
