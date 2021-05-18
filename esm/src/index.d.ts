import { DependencyList } from "react";
/**
 * 指定依赖的初次调度是否已进行
 *
 * @export
 * @param {DependencyList} [deps=[]]
 * @return {*}
 */
export declare function useStartedRef(deps?: DependencyList): import("react").MutableRefObject<boolean>;
/**
 * 当前空间数据是否被销毁
 *
 * @export
 * @return {*}
 */
export declare function useEndRef(): import("react").MutableRefObject<boolean>;
/**
 * 利用 ref 记录一个值
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export declare function useMemoRef<T>(state: T): import("react").MutableRefObject<T>;
/**
 * 调度信息结构
 * value: 当前值
 * pre: 前值
 * effectTime: 调度时间
 * history：调度历史（仅在 useInfoRef 设置了 len 参数之后生效）
 * effected：当前作用域是否调度
 *
 * @export
 * @interface RefInfo
 * @template T
 */
export interface RefInfo<T> {
    value: T;
    pre: T | undefined;
    effectTime: number;
    history: RefInfo<T>[];
    effected: boolean;
}
/**
 * 按照依赖数组获取调度信息
 *
 * @export
 * @template T
 * @param {() => T} cb
 * @param {DependencyList} [deps=[]]
 * @param {number} [len=0]
 * @return {*}
 */
export declare function useInfoRef<T>(cb: () => T, deps?: DependencyList, len?: number): import("react").MutableRefObject<RefInfo<T>>;
/**
 * delay time
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export declare function useDelay<T extends any[]>(func: (...args: T) => void, t?: number): [(...args: T) => void, () => void];
/**
 * 防抖
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export declare function useDebounce<T extends any[]>(func: (...args: T) => void, t?: number): (...args: T) => void;
/**
 * 节流
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export declare function useThrottle<T extends any[]>(func: (...args: T) => void, t?: number): (...args: T) => void;
