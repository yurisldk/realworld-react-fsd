import { IoTrash } from 'react-icons/io5'
import { useDeleteCommentMutation } from './delete-comment.mutation'

type DeleteCommentButttonProps = {
  slug: string
  id: number
}

export function DeleteCommentButtton(props: DeleteCommentButttonProps) {
  const { slug, id } = props

  const { mutate } = useDeleteCommentMutation({ mutationKey: [slug, id] })

  const handleClick = () => {
    mutate({ slug, id })
  }

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      style={{ border: 0, backgroundColor: 'transparent' }}
      className="mod-options"
      onClick={handleClick}
      type="button"
    >
      <span>
        <IoTrash size={14} />
      </span>
    </button>
  )
}
