type ErrorListProps = {
  errors: { [key: string]: { message: string } }
}

export function ErrorList(props: ErrorListProps) {
  const { errors } = props

  return (
    <ul className="error-messages">
      {Object.values(errors).map((error) => (
        <li key={error.message}>{error.message}</li>
      ))}
    </ul>
  )
}
