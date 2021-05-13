import { DependencyList, useMemo } from "react";

/**
 * return the element in certain condition
 *
 * @export
 * @param {(JSX.Element | null | undefined | number | string)} el
 * @param {DependencyList} deps
 * @return {*}
 */
export function useConditionEl(
  el: JSX.Element | null | undefined | number | string,
  deps: DependencyList
) {
  return useMemo(() => el, deps);
}
