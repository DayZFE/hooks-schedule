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
export declare function useNoDepCallback<T, R>(dataCb: () => T, cb: (val: T) => R): () => R;
