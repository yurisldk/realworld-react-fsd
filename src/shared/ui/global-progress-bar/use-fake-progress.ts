import { useEffect, useRef, useState } from 'react';

interface UseFakeProgressOptions {
  isAnimating: boolean;
  animationDuration?: number;
  incrementDuration?: number;
  minimum?: number;
}

interface UseFakeProgressReturn {
  progress: number;
  isFinished: boolean;
  animationDuration: number;
}

export function useFakeProgress({
  isAnimating,
  animationDuration = 200,
  incrementDuration = 800,
  minimum = 0.08,
}: UseFakeProgressOptions): UseFakeProgressReturn {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getIncrement = (currentProgress: number): number => {
    if (currentProgress >= 0 && currentProgress < 0.2) return 0.1; // 0-20%: big jumps
    if (currentProgress >= 0.2 && currentProgress < 0.5) return 0.04; // 20-50%: medium
    if (currentProgress >= 0.5 && currentProgress < 0.8) return 0.02; // 50-80%: small
    if (currentProgress >= 0.8 && currentProgress < 0.99) return 0.005; // 80-99%: tiny
    return 0; // Stop at 99%
  };

  useEffect(() => {
    if (isAnimating) {
      setIsFinished(false);
      setProgress(minimum);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const increment = getIncrement(prev);
          const next = prev + increment;
          return next >= 0.994 ? 0.994 : next;
        });
      }, incrementDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(1);

      const timeoutId = setTimeout(() => {
        setIsFinished(true);
      }, animationDuration);

      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnimating, minimum, incrementDuration, animationDuration]);

  return { progress, isFinished, animationDuration };
}
