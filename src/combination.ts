import { DependencyList, MutableRefObject, useEffect, useRef } from "react";

/**
 * filter schedule from useXxxRef schedule api
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {(val: T) => boolean} filter
 * @return {*}  {MutableRefObject<boolean>}
 */
export function useScheduleFilter<T>(
  filter: (val: T) => boolean,
  ref: MutableRefObject<T>
): MutableRefObject<boolean> {
  const result = useRef<boolean>(false);
  useEffect(() => {
    result.current = filter(ref.current);
  });
  useEffect(() => {}, []);
  return result;
}

/**
 * combine refs together
 *
 * @export
 * @param {(...val: boolean[]) => boolean} combineCb
 * @param {MutableRefObject<boolean>[]} refs
 * @return {*}  {MutableRefObject<boolean>}
 */
export function useScheduleCombine(
  combineCb: (...val: boolean[]) => boolean,
  refs: MutableRefObject<boolean>[]
): MutableRefObject<boolean> {
  const result = useRef<boolean>(false);
  useEffect(() => {
    result.current = combineCb(...refs.map((el) => el.current));
  });
  return result;
}