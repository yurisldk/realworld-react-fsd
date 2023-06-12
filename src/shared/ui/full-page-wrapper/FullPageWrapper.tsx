import { ReactNode } from 'react';
import styles from './full-page-wrapper.module.css';

type FullPageWrapperProps = {
  children: ReactNode;
};

export function FullPageWrapper(props: FullPageWrapperProps) {
  const { children } = props;

  return <div className={styles.wrapper}>{children}</div>;
}
