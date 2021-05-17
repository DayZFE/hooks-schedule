import { DependencyList, MutableRefObject } from "react";
/**
 * deps?: DependencyList
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {DependencyList} [deps]
 * @return {*}
 */
export declare function useRefToState<T>(ref: MutableRefObject<T>, deps?: DependencyList): T;
/**
 * get a timer that emits Date type time data
 *
 * by interval of certain ms
 *
 * @param {number} [n=1000]
 * @return {*}
 */
export declare function useTimer(n?: number): Date;
