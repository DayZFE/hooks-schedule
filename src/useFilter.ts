import { useEffect, useState } from "react";

/**
 * hooks version of 'shouldStateUpdate'
 *
 * @export
 * @template T
 * @param {T} state
 * @param {(((val: T) => boolean) | boolean)} condition
 * @param {T} [initialValue]
 * @return {*}
 */
export default function useFilter<T>(
  state: T,
  condition: ((val: T) => boolean) | boolean,
  initialValue?: T
) {
  const [value, setValue] = useState<T>((() => {
    let startCondition = true;
    if (typeof condition === "function") {
      startCondition = condition(state);
    } else {
      startCondition = condition;
    }
    if (!startCondition) {
      throw new Error(
        "[useFilter] state initial or initialValue cannot be all disMatch"
      );
    } else {
      return state || initialValue;
    }
  }) as any);
  useEffect(() => {
    if (typeof condition === "function") {
      if (condition(state)) setValue(state);
    } else {
      if (condition) setValue(state);
    }
  }, [state]);
  return value;
}
