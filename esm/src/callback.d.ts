import { MutableRefObject } from "react";
/**
 * callback that with no dependency
 *
 * but relay on first cb's return
 *
 * @export
 * @template T
 * @template R
 * @param {() => T} dataCb
 * @param {(val: T) => R} cb
 * @return {*}
 */
export declare function useNoDepCallback<T, P extends any[], R>(dataCb: () => T, cb: (val: MutableRefObject<T>, ...args: P) => R): (args: P) => R;
