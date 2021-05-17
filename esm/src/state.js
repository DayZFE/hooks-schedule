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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimer = exports.useRefToState = void 0;
var react_1 = require("react");
var basic_1 = require("./basic");
/**
 * deps?: DependencyList
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {DependencyList} [deps]
 * @return {*}
 */
function useRefToState(ref, deps) {
    var _a = __read(react_1.useState(function () { return ref.current; }), 2), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        setState(ref.current);
    }, deps);
    return state;
}
exports.useRefToState = useRefToState;
/**
 * get a timer that emits Date type time data
 *
 * by interval of certain ms
 *
 * @param {number} [n=1000]
 * @return {*}
 */
function useTimer(n) {
    if (n === void 0) { n = 1000; }
    var _a = __read(react_1.useState(function () { return new Date(); }), 2), timer = _a[0], setTimer = _a[1];
    var preTimeRef = basic_1.usePreviousRef(timer);
    var endRef = basic_1.useEndRef();
    var handleRaf = react_1.useCallback(function () {
        if (endRef.current)
            return;
        var now = new Date();
        if (!preTimeRef.current) {
            preTimeRef.current = now;
            setTimer(now);
        }
        else if (now.getTime() - preTimeRef.current.getTime() >= n) {
            preTimeRef.current = now;
            setTimer(now);
        }
        requestAnimationFrame(handleRaf);
    }, [n, endRef, preTimeRef]);
    react_1.useEffect(function () {
        requestAnimationFrame(handleRaf);
    }, [handleRaf]);
    return timer;
}
exports.useTimer = useTimer;
//# sourceMappingURL=state.js.map