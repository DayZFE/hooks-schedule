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
exports.useScheduleCombine = exports.useScheduleFilter = void 0;
var react_1 = require("react");
/**
 * filter schedule from useXxxRef schedule api
 *
 * @export
 * @template T
 * @param {MutableRefObject<T>} ref
 * @param {(val: T) => boolean} filter
 * @return {*}  {MutableRefObject<boolean>}
 */
function useScheduleFilter(filter, ref, deps) {
    var result = react_1.useRef(false);
    react_1.useEffect(function () {
        result.current = filter(ref.current);
    }, deps);
    return result;
}
exports.useScheduleFilter = useScheduleFilter;
/**
 * combine refs together
 *
 * @export
 * @param {(...val: boolean[]) => boolean} combineCb
 * @param {MutableRefObject<boolean>[]} refs
 * @return {*}  {MutableRefObject<boolean>}
 */
function useScheduleCombine(combineCb, refs, deps) {
    var result = react_1.useRef(false);
    react_1.useEffect(function () {
        result.current = combineCb.apply(void 0, __spreadArray([], __read(refs.map(function (el) { return el.current; }))));
    }, deps);
    return result;
}
exports.useScheduleCombine = useScheduleCombine;
//# sourceMappingURL=combination.js.map