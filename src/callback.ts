import { useCallback } from "react";
import { useMemoRef } from "./basic";

/**
 * callback that with no dependency
 *
 * but relay on first cb's return
 *
 * @export
 * @template T
 * @template R
 * @param {() => T} dataCb
 * @param {(val: T) => R} cb
 * @return {*}
 */
export function useNoDepCallback<T, R>(dataCb: () => T, cb: (val: T) => R) {
  const memoRef = useMemoRef<T>(dataCb);
  const result = useCallback(() => {
    const dep = memoRef.current;
    return cb(dep);
  }, []);
  return result;
}
