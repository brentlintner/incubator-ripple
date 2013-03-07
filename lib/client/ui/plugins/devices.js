/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// TODO: How to better organize parts of layout module with this top level module.
var layout = ripple('ui/plugins/devices/layout'),
    db = ripple('db'),
    utils = ripple('utils'),
    bridge = ripple('emulatorBridge');


function initialize(/*prev, baton*/) {
    layout.initialize();

    utils.bindAutoSaveEvent(
        $("#viewport-zoom").val(100),
        function () {
            var percent = $("#viewport-zoom").val();
            $("#viewport-zoom-range").val(percent);
            $(bridge.document()).find("html").css("zoom", percent + "%");
        });

    $("#viewport-zoom-range")
        .val(100)
        .change(function () {
            var percent = $(this).val();
            $("#viewport-zoom").val(percent);
            $(bridge.document()).find("html").css("zoom", percent + "%");
        });

    utils.bindAutoSaveEvent(
        $("#device-zoom").val(100),
        function () {
            var percent = $("#device-zoom").val();
            $("#device-zoom-range").val(percent);
            $('.device-wrapper').css("zoom", percent + "%");
        });

    $("#device-zoom-range")
        .val(100)
        .change(function () {
            var percent = $(this).val();
            $("#device-zoom").val(percent);
            $('.device-wrapper').css("zoom", percent + "%");
        });

    // TODO: width/height

    // TODO:
    utils.bindAutoSaveEvent(
        $("#device-pixel-ratio").val("1.00"),
        function () {
            var ratio = $("#device-pixel-ratio").val();
            $("#device-pixel-ratio-range").val(ratio);
        });

    $("#device-pixel-ratio-range")
        .val("1.00")
        .change(function () {
            $("#device-pixel-ratio").val($(this).val());
        });
}

module.exports = {
    panel: {
        domId: "devices-container",
        collapsed: true,
        pane: "left"
    },
    initialize: initialize
};
