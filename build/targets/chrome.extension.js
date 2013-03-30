/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var fs = require('fs'),
    path = require('path'),
    cp = require('shelljs').cp,
    utils = require('./../utils'),
    _c = require('./../conf');

module.exports = function (src/*, baton*/) {
    cp("-r", _c.EXT + "chrome.extension", _c.DEPLOY);
    cp("-r", _c.ASSETS + path.join("client", "images"), _c.DEPLOY + "chrome.extension");
    cp("-r", _c.ASSETS + path.join("client", "themes"), _c.DEPLOY + "chrome.extension");

    var css = _c.ASSETS + "client/ripple.css",
        cssDeploy = _c.DEPLOY + "chrome.extension/ripple.css",
        manifest = _c.DEPLOY + "chrome.extension/manifest.json",
        manifestJSON = JSON.parse(fs.readFileSync(manifest, "utf-8")),
        js = _c.DEPLOY + "chrome.extension/ripple.js",
        bootstrap = _c.DEPLOY + "chrome.extension/bootstrap.js",
        htmlui = _c.DEPLOY + "chrome.extension/ui.html",
        resourceList = [],
        doc = src.html.replace(/#OVERLAY_VIEWS#/g, src.overlays)
                      .replace(/#PANEL_VIEWS#/g, src.panels)
                      .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                      .replace(_c.SPACES_AND_TABS, " ")
                      .replace(/'/g, _c.ESCAPED_QUOTES);

    fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

    fs.writeFileSync(htmlui, doc, "utf-8");

    fs.writeFileSync(bootstrap,
                     "window.th_panel = {" + "LAYOUT_HTML: '" + doc + "'};" +
                     fs.readFileSync(bootstrap, "utf-8"));

    fs.writeFileSync(js,
        src.js +
        "ripple('bootstrap').bootstrap();"
    );

    utils.collect(_c.DEPLOY + "/chrome.extension", resourceList, function () {
        return true;
    });

    manifestJSON.version = src.info.version;
    manifestJSON.web_accessible_resources = resourceList.map(function (p) {
        return p.replace(path.normalize(_c.DEPLOY + "/chrome.extension/"), '');
    });

    fs.writeFileSync(manifest, JSON.stringify(manifestJSON), "utf-8");

    return src;
};
