import { DependencyList } from "react";
/**
 * log the effect time of dependencies
 *
 * @export
 * @param {DependencyList} deps
 * @return {*}
 */
export declare function useEffectTimeRef(deps?: DependencyList): import("react").MutableRefObject<Date>;
/**
 * after such buffer, emit effect time value before
 *
 * @export
 * @param {DependencyList} [deps]
 * @param {number} [bufferCount=0]
 */
export declare function usePreviousEffectTimeRef(deps?: DependencyList, bufferCount?: number): void;
