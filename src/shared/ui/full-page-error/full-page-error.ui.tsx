import { GenericError } from '~shared/lib/fetch';
import { ErrorHandler } from '../error';
import styles from './full-page-error.module.css';

type FullPageErrorProps = {
  error: GenericError<any>;
};

export function FullPageError(props: FullPageErrorProps) {
  const { error } = props;

  return (
    <div className={styles['outer-wrapper']}>
      <div className={styles['inner-wrapper']}>
        <div className="container">
          <h1 className="logo-font">Something went wrong:</h1>
          <ErrorHandler error={error} size="small" />
        </div>
      </div>
    </div>
  );
}
