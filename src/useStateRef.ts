import { useEffect, useRef } from "react";

/**
 * get the ref of state
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useStateRef<T>(state: T) {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref;
}
