import { DependencyList, MutableRefObject, useEffect, useRef } from "react";

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
 * get the previous ref value of memorized state after certain buffer
 *
 * @export
 * @template T
 * @param {T} state
 * @param {number} [bufferCount=0]
 * @return {*}
 */
export function usePreviousRef<T>(state: T, bufferCount: number = 0) {
  const result = useRef<T | undefined>();
  const buffer = useRef(0);
  useEffect(() => {
    if (buffer.current < bufferCount) {
      buffer.current++;
    } else {
      buffer.current = 0;
      Promise.resolve().then(() => {
        result.current = state;
      });
    }
  }, [state]);
  return result;
}

/**
 * output a ref that contains all the relative data
 *
 * @export
 * @template T
 * @param {() => T} cb
 * @param {DependencyList} deps
 * @return {*}  {MutableRefObject<T>}
 */
export function useMemoRef<T>(
  cb: () => T,
  deps?: DependencyList
): MutableRefObject<T> {
  const result = useRef(cb());
  useEffect(() => {
    result.current = cb();
  }, deps);
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
