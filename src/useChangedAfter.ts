import { useEffect, useRef } from "react";
import { useChanged } from "./useChanged";
import { useStarted } from "./useStarted";

/**
 * initialized and changed
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useChangedAfter<T>(state: T) {
  const changed = useChanged(state);
  const started = useStarted(state);
  const changedAfter = useRef(false);
  useEffect(() => {
    changedAfter.current = changed.current && started.current;
    Promise.resolve().then(() => {
      changedAfter.current = false;
    });
  }, [state, changed, started]);
  return changedAfter;
}
