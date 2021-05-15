import { DependencyList, MutableRefObject, useEffect, useRef } from "react";

/**
 * filter schedule from useXxxRef schedule api
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {(val: T) => boolean} filter
 * @param {DependencyList} [deps]
 * @return {*}  {MutableRefObject<boolean>}
 */
export function useScheduleFilter<T>(
  ref: MutableRefObject<T>,
  filter: (val: T) => boolean,
  deps?: DependencyList
): MutableRefObject<boolean> {
  const result = useRef<boolean>(false);
  useEffect(() => {
    result.current = filter(ref.current);
  }, deps);
  useEffect(() => {}, []);
  return result;
}

export function useScheduleCombine(
  combineCb: (...val: boolean[]) => boolean,
  refs: MutableRefObject<boolean>[],
  deps?: DependencyList
): MutableRefObject<boolean> {
  const result = useRef<boolean>(false);
  useEffect(() => {
    result.current = combineCb(...refs.map((el) => el.current));
  }, deps);
  return result;
}
