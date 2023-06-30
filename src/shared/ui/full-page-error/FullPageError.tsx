import { FullPageWrapper } from '../full-page-wrapper';
import styles from './fullPageError.module.css';

type FullPageErrorProps = {
  error: any;
};

export function FullPageError(props: FullPageErrorProps) {
  const { error } = props;

  return (
    <FullPageWrapper>
      <div className={styles.wrapper}>
        <div className="container">
          <h1 className="logo-font">Something went wrong:</h1>
          <ul className="error-messages">{error?.message}</ul>
        </div>
      </div>
    </FullPageWrapper>
  );
}
