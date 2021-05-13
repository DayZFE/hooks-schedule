import { useEffect, useRef } from "react";
import { usePrevious } from "./usePrevious";

/**
 * changed
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useChanged<T>(state: T) {
  const changed = useRef(false);
  const pre = usePrevious(state);
  useEffect(() => {
    if (state !== pre.current) {
      changed.current = true;
      Promise.resolve().then(() => {
        changed.current = false;
      });
    } else {
      changed.current = false;
    }
  }, [pre, state]);
  return changed;
}
