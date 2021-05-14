import { DependencyList, useEffect, useRef, useState } from "react";

/**
 * 将 state or memorized 转化成 ref（按照特定依赖）
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
export function useStateRef<T>(state: T, deps: DependencyList = []) {
  const result = useRef<T | undefined>();
  useEffect(() => {
    result.current = state;
    // eslint-disable-next-line
  }, [state, ...deps]);
  return result;
}

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
 * 获取前值的 ref（按照特定依赖）
 *
 * @export
 * @template T
 * @param {T} state
 * @param {DependencyList} [deps=[]]
 * @return {*}
 */
export function usePreviousRef<T>(state: T) {
  const result = useRef<T | undefined>();
  useEffect(() => {
    Promise.resolve().then(() => {
      result.current = state;
    });
  }, [state]);
  return result;
}

/**
 * 获取历史（按照特定依赖）
 *
 * @export
 * @template T
 * @param {T} state
 * @param {DependencyList} [deps=[]]
 * @param {number} [length=3]
 * @return {*}
 */
export function useHistoryRef<T>(
  state: T,
  deps: DependencyList = [],
  length = 3
) {
  const result = useRef<T[]>([]);
  useEffect(() => {
    result.current.unshift(state);
    result.current.length = length;
    // eslint-disable-next-line
  }, [state, ...deps]);
  return result;
}

/**
 * get a timer cont from 0
 *
 * @param {number} [n=1000]
 * @return {*}
 */
export function useTimer(n: number = 1000) {
  const [timer, setTimer] = useState(() => new Date());
  const preTimeRef = usePreviousRef(timer);
  const endRef = useEndRef();
  useEffect(() => {
    function loop() {
      if (endRef.current) return;
      const now = new Date();
      if (!preTimeRef.current) {
        preTimeRef.current = now;
      } else if (now.getTime() - preTimeRef.current.getTime() >= n) {
        preTimeRef.current = now;
        setTimer(now);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }, [n, endRef, preTimeRef]);

  return timer;
}
