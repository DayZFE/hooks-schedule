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

export type FunctionType<P extends any[], R> = (...args: P) => R;

/**
 * delay time
 *
 * @export
 * @template P
 * @template R
 * @param {FunctionType<P,R>} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useDelay<P extends any[], R>(
  func: FunctionType<P, R>,
  t = 1000
) {
  const [result, setResult] = useState<R>();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number>(0);
  const funcRef = useMemoRef(func);
  const tRef = useMemoRef(t);
  const start = useCallback((...args: Parameters<typeof func>) => {
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      setResult(funcRef.current(...args));
      setLoading(false);
    }, tRef.current);
  }, []);
  const close = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  return [start, close, result, loading] as [
    (...args: Parameters<typeof func>) => void,
    () => void,
    R,
    boolean
  ];
}

/**
 * 防抖
 *
 * @export
 * @template P
 * @template R
 * @param {FunctionType<P,R>} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useDebounce<P extends any[], R>(
  func: FunctionType<P, R>,
  t = 1000
) {
  const [start, close, result, loading] = useDelay(func, t);
  const dispatch = useCallback(
    (...args: Parameters<typeof func>) => {
      close();
      start(...args);
    },
    [start, close]
  );
  return [dispatch, result, loading] as [
    (...args: Parameters<typeof func>) => void,
    R,
    boolean
  ];
}

/**
 * 节流
 *
 * @export
 * @template P
 * @template R
 * @param {FunctionType<P,R>} func
 * @param {number} [t=1000]
 * @return {*}
 */
export function useThrottle<P extends any[], R>(
  func: FunctionType<P, R>,
  t = 1000
) {
  const canRun = useRef(true);
  const funcRef = useMemoRef(func);
  const trigger = useCallback((...args: Parameters<typeof func>) => {
    canRun.current = true;
    return funcRef.current(...args);
  }, []);
  const [start, _, result, loading] = useDelay(trigger, t);
  const dispatch = useCallback(
    (...args: Parameters<typeof func>) => {
      if (canRun.current === true) {
        canRun.current = false;
        start(...args);
      }
    },
    [start]
  );
  return [dispatch, result, loading] as [
    (...args: Parameters<typeof func>) => void,
    R,
    boolean
  ];
}

/**
 * get time interval
 *
 * @param {number} [interval=1000]
 * @return {*}
 */
export function useTimer(interval = 1000) {
  const [time, setTime] = useState(() => Date.now());
  const intervalRef = useMemoRef(interval);
  useEffect(() => {
    const i = setInterval(() => {
      setTime(Date.now());
    }, intervalRef.current);
    return () => {
      clearInterval(i);
    };
  }, []);
  return time;
}

/**
 * 该 function 为 action，result 模式
 *
 * @template P
 * @template R
 * @param {FunctionType<P, R>} func
 * @return {*}
 */
export function useDispatch<P extends any[], R>(func: FunctionType<P, R>) {
  const [action, setAction] = useState<() => P | "__initialized__">(
    () => () => "__initialized__"
  );
  const [result, setResult] = useState<R>();
  const funcRef = useMemoRef(func);
  useEffect(() => {
    const params = action();
    if (params !== "__initialized__") {
      setResult(funcRef.current(...params));
    }
  }, [action]);
  const dispatch = useCallback((...args: Parameters<typeof func>) => {
    setAction(() => args);
  }, []);
  return [dispatch, action, result] as [
    (...args: Parameters<typeof func>) => void,
    () => P | "__initialized__",
    R
  ];
}
