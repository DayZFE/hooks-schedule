import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * 指定依赖的初次调度是否已进行
 *
 * @export
 * @param {DependencyList} [deps=[]]
 * @return {*}
 */
export function useStartedRef(deps: DependencyList = []) {
  const result = useRef(false);
  useEffect(() => {
    Promise.resolve().then(() => {
      result.current = true;
    });
    // eslint-disable-next-line
  }, deps);
  return result;
}

/**
 * 当前空间数据是否被销毁
 *
 * @export
 * @return {*}
 */
export function useEndRef() {
  const result = useRef(false);
  useEffect(
    () => () => {
      result.current = true;
    },
    []
  );
  return result;
}

/**
 * 利用 ref 记录一个值
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useMemoRef<T>(state: T) {
  const result = useRef(state);
  useEffect(() => {
    result.current = state;
  });
  return result;
}

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
export function useInfoRef<T>(cb: () => T, deps: DependencyList = [], len = 0) {
  const result = useRef<RefInfo<T>>({
    value: cb(),
    pre: undefined,
    effectTime: -1,
    history: [],
    effected: false,
  });
  useEffect(() => {
    let history: RefInfo<T>[] = [];
    if (len > 0) {
      history = [result.current].concat(result.current.history);
      if (history.length > len) {
        history.length = len;
      }
    }
    result.current = {
      value: cb(),
      pre: result.current.value,
      effectTime: Date.now(),
      history,
      effected: true,
    };
    Promise.resolve().then(() => {
      result.current.effected = false;
    });
    // eslint-disable-next-line
  }, deps);
  return result;
}

/// --------- 以下 hooks 都只针对函数， 用于 callback

/**
 * delay time
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useDelay<T extends any[]>(
  func: (...args: T) => void,
  t = 1000
) {
  const timeoutRef = useRef<number>(0);
  const start = useCallback(
    (...args: T) => {
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, t);
    },
    [func, t]
  );
  const close = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  return [start, close] as [(...args: T) => void, () => void];
}

/**
 * 防抖
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useDebounce<T extends any[]>(
  func: (...args: T) => void,
  t = 1000
) {
  const [start, close] = useDelay(func, t);
  return useCallback(
    (...args: T) => {
      close();
      start(...args);
    },
    [start, close]
  );
}

/**
 * 节流
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useThrottle<T extends any[]>(
  func: (...args: T) => void,
  t = 1000
) {
  const canRun = useRef(true);
  const trigger = useCallback(
    (...args: T) => {
      canRun.current = true;
      func(...args);
    },
    [func]
  );
  const [start] = useDelay(trigger, t);
  return useCallback(
    (...args: T) => {
      if (canRun.current === true) {
        canRun.current = false;
        start(...args);
      }
    },
    [start]
  );
}

function useTimer(interval = 1000) {
  const [time, setTime] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => {
      setTime(Date.now());
    }, interval);
    return () => {
      clearInterval(i);
    };
  }, [interval]);
  return time;
}
