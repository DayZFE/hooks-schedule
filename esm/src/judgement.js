"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangedRef = void 0;
var react_1 = require("react");
var basic_1 = require("./basic");
/**
 * judge if state changed
 *
 * @export
 * @param {*} state
 * @return {*}
 */
function useChangedRef(state) {
    var result = react_1.useRef(false);
    var previousRef = basic_1.usePreviousRef(state);
    react_1.useEffect(function () {
        if (state !== previousRef.current) {
            result.current = true;
        }
        else {
            result.current = false;
        }
    }, [state]);
    return result;
}
exports.useChangedRef = useChangedRef;
//# sourceMappingURL=judgement.js.map