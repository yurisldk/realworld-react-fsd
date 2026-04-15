import type { ErrorFields } from '~shared/api/action-result';

type ErrorMessagesProps = {
  errors: ErrorFields;
};

export function ErrorMessages({ errors }: ErrorMessagesProps) {
  const messages = Object.entries(errors).flatMap(([field, errorMessages]) =>
    errorMessages.map((message) => (field === 'body' ? message : `${field} ${message}`)),
  );

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul className="error-messages">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}
