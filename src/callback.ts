import { MutableRefObject, useCallback } from "react";
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
export function useNoDepCallback<T, P extends any[], R>(
  dataCb: () => T,
  cb: (val: MutableRefObject<T>, ...args: P) => R
) {
  const memoRef = useMemoRef<T>(dataCb);
  const result = useCallback((args: P) => {
    return cb(memoRef, ...args);
  }, []);
  return result;
}
