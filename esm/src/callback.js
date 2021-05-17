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
exports.useNoDepCallback = void 0;
var react_1 = require("react");
var basic_1 = require("./basic");
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
function useNoDepCallback(dataCb, cb) {
    var memoRef = basic_1.useMemoRef(dataCb);
    var result = react_1.useCallback(function (args) {
        return cb.apply(void 0, __spreadArray([memoRef], __read(args)));
    }, []);
    return result;
}
exports.useNoDepCallback = useNoDepCallback;
//# sourceMappingURL=callback.js.map