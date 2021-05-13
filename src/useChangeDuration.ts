import { useEffect, useRef, useState } from "react";

/**
 * -1 not initialized
 * 0 first change
 * time last change duration util now
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useChangeDuration<T>(state: T) {
  const previousTime = useRef(0);
  const [duration, setDuration] = useState(-1);
  useEffect(() => {
    const now = Date.now();
    if (previousTime.current === 0) {
      setDuration(0);
    } else {
      setDuration(now - previousTime.current);
    }
    previousTime.current = now;
  }, [state]);
  return duration;
}
