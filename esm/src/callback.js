"use strict";
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
    var result = react_1.useCallback(function () {
        var dep = memoRef.current;
        return cb(dep);
    }, []);
    return result;
}
exports.useNoDepCallback = useNoDepCallback;
//# sourceMappingURL=callback.js.map