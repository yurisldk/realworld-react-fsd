import { useAsyncError } from 'react-router';
import { getErrorMessage } from '~shared/lib/react-router/getErrorMessage';

type AsyncErrorCardProps = {
  title: string;
  fallbackMessage: string;
};

export function AsyncErrorCard({ title, fallbackMessage }: AsyncErrorCardProps) {
  const error = useAsyncError();
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">
          <strong>{title}</strong>
        </p>
        <p className="card-text">{getErrorMessage(error, fallbackMessage)}</p>
      </div>
    </div>
  );
}
