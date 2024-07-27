import { IoTrash } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { pathKeys } from '~shared/lib/react-router'
import { spinnerModel } from '~shared/ui/spinner'
import { useDeleteArticleMutation } from './delete-article.mutation'

type DeleteArticleButtonProps = { slug: string }

export function DeleteArticleButton(props: DeleteArticleButtonProps) {
  const { slug } = props

  const navigate = useNavigate()

  const { mutate, isPending } = useDeleteArticleMutation({
    mutationKey: [slug],

    onMutate: () => {
      spinnerModel.globalSpinner.getState().show()
    },

    onSuccess: () => {
      navigate(pathKeys.home(), { replace: true })
    },

    onSettled: () => {
      spinnerModel.globalSpinner.getState().hide()
    },
  })

  const handleClick = () => {
    mutate(slug)
  }

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline-danger btn-sm"
      type="button"
      disabled={isPending}
    >
      <IoTrash size={16} />
      &nbsp;Delete Article
    </button>
  )
}
