import { DependencyList, useEffect, useRef } from "react";

/**
 * log the effect time of dependencies
 *
 * @export
 * @param {DependencyList} deps
 * @return {*}
 */
export function useEffectTimeRef(deps?: DependencyList) {
  const result = useRef<Date>(new Date());

  useEffect(() => {
    result.current = new Date();
  }, deps);
  return result;
}

/**
 * after such buffer, emit effect time value before
 *
 * @export
 * @param {DependencyList} [deps]
 * @param {number} [bufferCount=0]
 */
export function usePreviousEffectTimeRef(
  deps?: DependencyList,
  bufferCount: number = 0
) {
  const result = useRef<Date>(new Date());
  const effectTimeRef = useEffectTimeRef(deps);
  const buffer = useRef(0);
  useEffect(() => {
    if (buffer.current < bufferCount) {
      buffer.current++;
    } else {
      buffer.current = 0;
      Promise.resolve().then(() => {
        result.current = effectTimeRef.current;
      });
    }
  }, deps);
}
