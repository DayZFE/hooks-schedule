import { useEffect, useRef, useState } from "react";
import { useChanged } from "./useChanged";

/**
 * the times of state change
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useChangedCount<T>(state: T) {
  const count = useRef(0);
  const stateChanged = useChanged(state);
  useEffect(() => {
    if (stateChanged) {
      Promise.resolve().then(() => {
        count.current++;
      });
    }
  }, [stateChanged, state]);
  return count;
}
