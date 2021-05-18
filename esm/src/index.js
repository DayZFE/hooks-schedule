"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThrottle = exports.useDebounce = exports.useDelay = exports.useInfoRef = exports.useMemoRef = exports.useEndRef = exports.useStartedRef = void 0;
var react_1 = require("react");
/**
 * 指定依赖的初次调度是否已进行
 *
 * @export
 * @param {DependencyList} [deps=[]]
 * @return {*}
 */
function useStartedRef(deps) {
    if (deps === void 0) { deps = []; }
    var result = react_1.useRef(false);
    react_1.useEffect(function () {
        Promise.resolve().then(function () {
            result.current = true;
        });
        // eslint-disable-next-line
    }, deps);
    return result;
}
exports.useStartedRef = useStartedRef;
/**
 * 当前空间数据是否被销毁
 *
 * @export
 * @return {*}
 */
function useEndRef() {
    var result = react_1.useRef(false);
    react_1.useEffect(function () { return function () {
        result.current = true;
    }; }, []);
    return result;
}
exports.useEndRef = useEndRef;
/**
 * 利用 ref 记录一个值
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
function useMemoRef(state) {
    var result = react_1.useRef(state);
    react_1.useEffect(function () {
        result.current = state;
    });
    return result;
}
exports.useMemoRef = useMemoRef;
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
function useInfoRef(cb, deps, len) {
    if (deps === void 0) { deps = []; }
    if (len === void 0) { len = 0; }
    var result = react_1.useRef({
        value: cb(),
        pre: undefined,
        effectTime: -1,
        history: [],
        effected: false,
    });
    react_1.useEffect(function () {
        var history = [];
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
            history: history,
            effected: true,
        };
        Promise.resolve().then(function () {
            result.current.effected = false;
        });
        // eslint-disable-next-line
    }, deps);
    return result;
}
exports.useInfoRef = useInfoRef;
/// --------- 以下 hooks 都只针对函数， 用于 callback
/**
 * delay time
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
function useDelay(func, t) {
    if (t === void 0) { t = 1000; }
    var timeoutRef = react_1.useRef(0);
    var start = react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        timeoutRef.current = setTimeout(function () {
            func.apply(void 0, __spreadArray([], __read(args)));
        }, t);
    }, [func, t]);
    var close = react_1.useCallback(function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);
    return [start, close];
}
exports.useDelay = useDelay;
/**
 * 防抖
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
function useDebounce(func, t) {
    if (t === void 0) { t = 1000; }
    var _a = __read(useDelay(func, t), 2), start = _a[0], close = _a[1];
    return react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        close();
        start.apply(void 0, __spreadArray([], __read(args)));
    }, [start, close]);
}
exports.useDebounce = useDebounce;
/**
 * 节流
 *
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [t=1000]
 * @return {*}
 */
function useThrottle(func, t) {
    if (t === void 0) { t = 1000; }
    var canRun = react_1.useRef(true);
    var trigger = react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        canRun.current = true;
        func.apply(void 0, __spreadArray([], __read(args)));
    }, [func]);
    var _a = __read(useDelay(trigger, t), 1), start = _a[0];
    return react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (canRun.current === true) {
            canRun.current = false;
            start.apply(void 0, __spreadArray([], __read(args)));
        }
    }, [start]);
}
exports.useThrottle = useThrottle;
function useTimer(interval) {
    if (interval === void 0) { interval = 1000; }
    var _a = __read(react_1.useState(function () { return Date.now(); }), 2), time = _a[0], setTime = _a[1];
    react_1.useEffect(function () {
        var i = setInterval(function () {
            setTime(Date.now());
        }, interval);
        return function () {
            clearInterval(i);
        };
    }, [interval]);
    return time;
}
//# sourceMappingURL=index.js.map