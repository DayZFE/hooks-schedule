"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffectTimeRef = exports.useHistoryRef = exports.useMemoRef = exports.usePreviousRef = exports.useStateRef = exports.useEndRef = exports.useStartedRef = void 0;
var react_1 = require("react");
/**
 * check the if the first effect callback already called
 *
 * @export
 * @return {*}
 */
function useStartedRef() {
    var result = react_1.useRef(false);
    react_1.useEffect(function () {
        Promise.resolve().then(function () {
            result.current = true;
        });
    }, []);
    return result;
}
exports.useStartedRef = useStartedRef;
/**
 * check if the scope already destroyed
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
 * change a memorized state to ref value
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
function useStateRef(state) {
    var result = react_1.useRef();
    react_1.useEffect(function () {
        result.current = state;
    }, [state]);
    return result;
}
exports.useStateRef = useStateRef;
/**
 * get the previous ref value of memorized state
 *
 * @export
 * @template T
 * @param {T} state
 * @return {*}
 */
function usePreviousRef(state) {
    var result = react_1.useRef();
    react_1.useEffect(function () {
        Promise.resolve().then(function () {
            result.current = state;
        });
    }, [state]);
    return result;
}
exports.usePreviousRef = usePreviousRef;
/**
 * output a ref that contains all the relative data
 *
 * @export
 * @template T
 * @param {() => T} cb
 * @param {DependencyList} deps
 * @return {*}  {MutableRefObject<T>}
 */
function useMemoRef(cb, deps) {
    var result = react_1.useRef(cb());
    react_1.useEffect(function () {
        result.current = cb();
    }, deps);
    return result;
}
exports.useMemoRef = useMemoRef;
/**
 * get the history ref value of certain dependencies
 *
 * @export
 * @template T
 * @param {T} deps
 * @param {number} [length=3]
 * @return {*}
 */
function useHistoryRef(deps, length) {
    if (length === void 0) { length = 3; }
    var result = react_1.useRef([]);
    react_1.useEffect(function () {
        result.current.unshift(deps);
        result.current.length = length;
    }, deps);
    return result;
}
exports.useHistoryRef = useHistoryRef;
/**
 * log the effect time of dependencies
 *
 * @export
 * @param {DependencyList} deps
 * @return {*}
 */
function useEffectTimeRef(deps) {
    var result = react_1.useRef(null);
    react_1.useEffect(function () {
        result.current = new Date();
    }, deps);
    return result;
}
exports.useEffectTimeRef = useEffectTimeRef;
//# sourceMappingURL=basic.js.map