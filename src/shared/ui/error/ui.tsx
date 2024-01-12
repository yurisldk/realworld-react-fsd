type ErrorHandlerProps = {
  error: Error;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error } = props;

  return (
    <ul className="error-messages">
      <li key={error.message}>{error.message}</li>
    </ul>
  );
}
