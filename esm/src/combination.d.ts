import { DependencyList, MutableRefObject } from "react";
/**
 * filter schedule from useXxxRef schedule api
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {(val: T) => boolean} filter
 * @return {*}  {MutableRefObject<boolean>}
 */
export declare function useScheduleFilter<T>(filter: (val: T) => boolean, ref: MutableRefObject<T>, deps?: DependencyList): MutableRefObject<boolean>;
/**
 * combine refs together
 *
 * @export
 * @param {(...val: boolean[]) => boolean} combineCb
 * @param {MutableRefObject<boolean>[]} refs
 * @return {*}  {MutableRefObject<boolean>}
 */
export declare function useScheduleCombine(combineCb: (...val: boolean[]) => boolean, refs: MutableRefObject<boolean>[], deps?: DependencyList): MutableRefObject<boolean>;
