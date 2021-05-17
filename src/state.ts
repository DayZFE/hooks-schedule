import {
  DependencyList,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useEndRef, usePreviousRef } from "./basic";

/**
 * deps?: DependencyList
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {DependencyList} [deps]
 * @return {*}
 */
export function useRefToState<T>(
  ref: MutableRefObject<T>,
  deps?: DependencyList
) {
  const [state, setState] = useState(() => ref.current);
  useEffect(() => {
    setState(ref.current);
  }, deps);
  return state;
}

/**
 * get a timer that emits Date type time data
 *
 * by interval of certain ms
 *
 * @param {number} [n=1000]
 * @return {*}
 */
export function useTimer(n: number = 1000) {
  const [timer, setTimer] = useState(() => new Date());
  const preTimeRef = usePreviousRef(timer);
  const endRef = useEndRef();
  const handleRaf = useCallback(() => {
    if (endRef.current) return;
    const now = new Date();
    if (!preTimeRef.current) {
      preTimeRef.current = now;
      setTimer(now);
    } else if (now.getTime() - preTimeRef.current.getTime() >= n) {
      preTimeRef.current = now;
      setTimer(now);
    }
    requestAnimationFrame(handleRaf);
  }, [n, endRef, preTimeRef]);
  useEffect(() => {
    requestAnimationFrame(handleRaf);
  }, [handleRaf]);

  return timer;
}
