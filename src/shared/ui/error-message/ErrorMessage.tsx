type ErrorMessageProps = {
  error: { message: string };
};

export function ErrorMessage(props: ErrorMessageProps) {
  const { error } = props;

  return (
    <ul className="error-messages">
      <li>{error.message}</li>
    </ul>
  );
}
