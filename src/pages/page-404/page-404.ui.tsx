import { Link } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import styles from './page-404.module.css';

export function Page404() {
  return (
    <div className={styles['outer-wrapper']}>
      <div className={styles['inner-wrapper']}>
        <div className="container">
          <h1 className="logo-font">Page not found</h1>
          <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
          <Link to={pathKeys.home()} className="btn btn-sm btn-outline-primary">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
