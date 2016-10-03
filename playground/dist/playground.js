"use strict";

var baseAddr = "http://blackmiaool.com/jquery-image-explode/playground/playground.html";
var ng = angular.module("app", []);

function extend(dest, src) {
    for (var i in src) {
        dest[i] = src[i];
    }
}
var settings = {
    previewDelay: {
        type: "number",
        title: "Delay time of exploding after adjusting params(ms)",
        min: 100,
        max: 3000,
        value: 0,
        initValue: 500
    },
    imageUrl: {
        type: "string",
        title: "You can use base64 image",
        value: "../try-jquery.jpg",
        initValue: "../try-jquery.jpg"
    }

};
for (var i in settings) {
    settings[i].name = i;
}
var effectUrl = {
    name: "effectUrl",
    type: "textarea",
    title: "Share the effect",
    value: location.href
};
var params = [{
    name: "minWidth",
    type: "number",
    title: "Minimum rag size",
    min: 1,
    max: 100,
    value: 0,
    initValue: 3
}, {
    name: "maxWidth",
    type: "number",
    title: "Maximum rag size(px)",
    min: 1,
    max: 100,
    value: 0,
    initValue: 12
}, {
    name: "radius",
    type: "number",
    title: "Explode radius(px)",
    min: 50,
    max: 300,
    value: 0,
    initValue: 235
}, {
    name: "release",
    type: "boolean",
    title: "If release rags after explosion",
    value: false,
    initValue: false
}, {
    name: "fadeTime",
    type: "number",
    title: "The time relasing rag fade",
    value: 0,
    initValue: 300
}, {
    name: "recycle",
    type: "boolean",
    title: "If recycle rags after explosion",
    value: false,
    initValue: false
}, {
    name: "recycleDelay",
    type: "number",
    title: "The time between explosion and recycle",
    value: 0,
    initValue: 500
}, {
    name: "explodeTime",
    type: "number",
    title: "The time during the explosion",
    min: 50,
    max: 1000,
    value: 0,
    initValue: 231
}, {
    name: "round",
    type: "boolean",
    title: "If use round rags",
    value: false,
    initValue: false
}, {
    name: "minAngle",
    type: "number",
    title: "The minimum angle rags rotate",
    min: 0,
    max: 5000,
    value: 0,
    initValue: 0
}, {
    name: "maxAngle",
    type: "number",
    title: "The maximum angle rags rotate",
    min: 0,
    max: 1000,
    value: 0,
    initValue: 360
}, {
    name: "gravity",
    type: "number",
    title: "If enable gravity effect",
    min: 0,
    max: 30,
    value: 0,
    initValue: 10
}, {
    name: "groundDistance",
    type: "number",
    title: "Distance between center and ground",
    min: 0,
    max: 235,
    value: 0,
    initValue: 235
}];
var initValue = location.href.split("?")[1];
if (initValue) {
    //    console.log(initValue)
    initValue = JSON.parse(decodeURIComponent(initValue));
    params.forEach(function (v, i) {
        if (!initValue.params.hasOwnProperty(v.name)) return;
        v.initValue = initValue.params[v.name];
    });
    for (var i in settings) {
        settings[i].initValue = initValue.settings[i];
    }
}
//console.log(settings, params)
//console.log(initValue)

function explode() {
    $("img").explodeRestore();
    setTimeout(function () {
        var finalParams = {};
        params.forEach(function (v) {
            var value = void 0;
            if (v.type === "number") {
                value = parseInt(v.value);
            } else {
                value = v.value;
            }
            finalParams[v.name] = value;
        });
        $("img").explode(finalParams);
    }, 600);
}

function generateEffectUrl() {
    var result = {
        settings: {},
        params: {}
    };
    for (var i in params) {
        result.params[params[i].name] = params[i].value;
    }
    for (var i in settings) {
        result.settings[i] = settings[i].value;
    }

    result = baseAddr + "?" + encodeURIComponent(JSON.stringify(result));
    effectUrl.value = result;
}
ng.controller("RootController", ["$scope", "$rootScope", "$timeout", function (sp, rsp, $timeout) {

    var timeout = void 0;

    function update(v, p) {
        if (JSON.stringify(v) === JSON.stringify(p)) {
            return;
        }
        generateEffectUrl();
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            timeout = 0;
            explode();
        }, settings.previewDelay.value);
    }

    sp.$watch("params", update, true);
    sp.$watch("settings", update, true);

    function setDefaultValue(obj) {
        for (var i in obj) {
            obj[i].value = obj[i].initValue;
        }
    }
    $timeout(function () {
        setDefaultValue(settings);
        setDefaultValue(params);
    });
    extend(sp, {
        explode: explode,
        params: params,
        settings: settings,
        effectUrl: effectUrl
    });
}]);