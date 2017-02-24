"use strict";
var through2 = require("through2");
var gutil = require("gulp-util");
var transform_1 = require("./transform");
var PLUGIN_NAME = "gulp-json-to-tsd";
module.exports = function (options) {
    function generate(file, encoding, callback) {
        if (file.isNull()) {
            this.push(transform_1.transform(file, {}, encoding, options));
            return callback();
        }
        if (file.isStream()) {
            callback(new gutil.PluginError(PLUGIN_NAME, "Streaming not supported"));
            return;
        }
        try {
            var json = require(file.path);
            this.push(transform_1.transform(file, json, encoding, options));
        }
        catch (ex) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, ex));
        }
        callback();
    }
    options = options || {};
    options.useInterfacePrefix = options.useInterfacePrefix || false;
    options.declareVariable = options.declareVariable || false;
    options.identStyle = options.identStyle || "tab";
    options.identSize = options.identSize || 1;
    return through2.obj(generate);
};
