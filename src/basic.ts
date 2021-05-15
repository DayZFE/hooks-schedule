import {
  DependencyList,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * check the if the first effect callback already called
 *
 * @export
 * @return {*}
 */
export function useStartedRef() {
  const result = useRef(false);
  useEffect(() => {
    Promise.resolve().then(() => {
      result.current = true;
    });
  }, []);
  return result;
}

/**
 * check if the scope already destroyed
 *
 * @export
 * @return {*}
 */
export function useEndRef() {
  const result = useRef(false);
  useEffect(
    () => () => {
      result.current = true;
    },
    []
  );
  return result;
}

/**
 * change a memorized state to ref value
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useStateRef<T>(state: T) {
  const result = useRef<T | undefined>();
  useEffect(() => {
    result.current = state;
  }, [state]);
  return result;
}

/**
 * get the previous ref value of memorized state
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function usePreviousRef<T>(state: T) {
  const result = useRef<T | undefined>();
  useEffect(() => {
    Promise.resolve().then(() => {
      result.current = state;
    });
  }, [state]);
  return result;
}

/**
 * get the history ref value of certain dependencies
 *
 * @export
 * @template T
 * @param {T} deps
 * @param {number} [length=3]
 * @return {*}
 */
export function useHistoryRef<T extends DependencyList>(deps: T, length = 3) {
  const result = useRef<T[]>([]);
  useEffect(() => {
    result.current.unshift(deps);
    result.current.length = length;
  }, deps);
  return result;
}

/**
 * log the effect time of dependencies
 *
 * @export
 * @param {DependencyList} deps
 * @return {*}
 */
export function useEffectTimeRef(deps: DependencyList) {
  const result = useRef<Date | null>(null);

  useEffect(() => {
    result.current = new Date();
  }, deps);
  return result;
}

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
  useEffect(() => {
    function loop() {
      if (endRef.current) return;
      const now = new Date();
      if (!preTimeRef.current) {
        preTimeRef.current = now;
      } else if (now.getTime() - preTimeRef.current.getTime() >= n) {
        preTimeRef.current = now;
        setTimer(now);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }, [n, endRef, preTimeRef]);

  return timer;
}
