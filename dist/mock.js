"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mock = (function () {
    function Mock(path, data, options) {
        this.path = path;
        this.data = data;
        this.options = options;
        this.path = path;
        this.data = data;
        if (options) {
            this.options.failRate =
                options.failRate > 1 ? 1 : options.failRate;
        }
    }
    return Mock;
}());
exports.Mock = Mock;
