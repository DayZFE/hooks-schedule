"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreviousEffectTimeRef = exports.useEffectTimeRef = void 0;
var react_1 = require("react");
/**
 * log the effect time of dependencies
 *
 * @export
 * @param {DependencyList} deps
 * @return {*}
 */
function useEffectTimeRef(deps) {
    var result = react_1.useRef(new Date());
    react_1.useEffect(function () {
        result.current = new Date();
    }, deps);
    return result;
}
exports.useEffectTimeRef = useEffectTimeRef;
/**
 * after such buffer, emit effect time value before
 *
 * @export
 * @param {DependencyList} [deps]
 * @param {number} [bufferCount=0]
 */
function usePreviousEffectTimeRef(deps, bufferCount) {
    if (bufferCount === void 0) { bufferCount = 0; }
    var result = react_1.useRef(new Date());
    var effectTimeRef = useEffectTimeRef(deps);
    var buffer = react_1.useRef(0);
    react_1.useEffect(function () {
        if (buffer.current < bufferCount) {
            buffer.current++;
        }
        else {
            buffer.current = 0;
            Promise.resolve().then(function () {
                result.current = effectTimeRef.current;
            });
        }
    }, deps);
}
exports.usePreviousEffectTimeRef = usePreviousEffectTimeRef;
//# sourceMappingURL=time.js.map