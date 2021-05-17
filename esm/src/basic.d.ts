import { DependencyList, MutableRefObject } from "react";
/**
 * check the if the first effect callback already called
 *
 * @export
 * @return {*}
 */
export declare function useStartedRef(): MutableRefObject<boolean>;
/**
 * check if the scope already destroyed
 *
 * @export
 * @return {*}
 */
export declare function useEndRef(): MutableRefObject<boolean>;
/**
 * change a memorized state to ref value
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export declare function useStateRef<T>(state: T): MutableRefObject<T | undefined>;
/**
 * get the previous ref value of memorized state after certain buffer
 *
 * @export
 * @template T
 * @param {T} state
 * @param {number} [bufferCount=0]
 * @return {*}
 */
export declare function usePreviousRef<T>(state: T, bufferCount?: number): MutableRefObject<T | undefined>;
/**
 * output a ref that contains all the relative data
 *
 * @export
 * @template T
 * @param {() => T} cb
 * @param {DependencyList} deps
 * @return {*}  {MutableRefObject<T>}
 */
export declare function useMemoRef<T>(cb: () => T, deps?: DependencyList): MutableRefObject<T>;
/**
 * get the history ref value of certain dependencies
 *
 * @export
 * @template T
 * @param {T} deps
 * @param {number} [length=3]
 * @return {*}
 */
export declare function useHistoryRef<T extends DependencyList>(deps: T, length?: number): MutableRefObject<T[]>;
