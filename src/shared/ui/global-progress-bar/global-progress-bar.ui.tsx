import { useNavigation } from 'react-router';
import * as styles from './global-progress-bar.module.css';
import { useFakeProgress } from './use-fake-progress';

export function GlobalProgressBar() {
  const navigation = useNavigation();
  const isAnimating = navigation.state !== 'idle';

  const { progress, isFinished, animationDuration } = useFakeProgress({
    isAnimating,
    animationDuration: 200,
    incrementDuration: 800,
    minimum: 0.08,
  });

  if (isFinished) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.bar}
        style={{
          transform: `translateX(${(progress - 1) * 100}%)`,
          transition: `transform ${animationDuration}ms ease-out`,
        }}
      />
    </div>
  );
}
