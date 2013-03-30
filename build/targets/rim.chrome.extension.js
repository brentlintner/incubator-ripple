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
var childProcess = require('child_process'),
    utils = require('./../utils'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    cp = shell.cp,
    join = path.join,
    _c = require('./../conf'),
    _EXT_DIR = "rim.chrome.extension";

module.exports = function (src/*, baton*/) {
    cp('-r', join(_c.EXT, 'chrome.extension/*') , join(_c.DEPLOY, _EXT_DIR));
    cp('-rf', join(_c.EXT + _EXT_DIR),  _c.DEPLOY);
    cp('-r', join(_c.ASSETS, 'client', 'images'), join(_c.DEPLOY, _EXT_DIR));
    cp('-r', join(_c.ASSETS + 'client', 'themes'), join(_c.DEPLOY + _EXT_DIR));

    if (fs.existsSync(join(_c.ROOT, 'services'))) {
        cp('-r', join(_c.ROOT, 'services'), path.join(_c.DEPLOY, _EXT_DIR));
    }

    if (fs.existsSync(join(_c.ROOT, 'plugins'))) {
        cp('-r', join(_c.ROOT, 'plugins'), path.join(_c.DEPLOY, _EXT_DIR));
    }

    var css = _c.ASSETS + "client/ripple.css",
        cssDeploy = _c.DEPLOY + _EXT_DIR + "/ripple.css",
        manifest = _c.DEPLOY + _EXT_DIR + "/manifest.json",
        updatesSrc = _c.EXT + _EXT_DIR + "/updates.xml",
        updatesDeploy = _c.DEPLOY + _EXT_DIR + "/updates.xml",
        js = _c.DEPLOY + _EXT_DIR + "/ripple.js",
        bootstrap = _c.DEPLOY + _EXT_DIR + "/bootstrap.js",
        manifestJSON = JSON.parse(fs.readFileSync(manifest, "utf-8")),
        resourceList = [],
        doc = src.html.replace(/#OVERLAY_VIEWS#/g, src.overlays)
                      .replace(/#PANEL_VIEWS#/g, src.panels)
                      .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                      .replace(_c.SPACES_AND_TABS, " ")
                      .replace(/'/g, _c.ESCAPED_QUOTES);

    fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

    fs.writeFileSync(updatesDeploy, fs.readFileSync(updatesSrc, "utf-8")
                     .replace(new RegExp('version=""', 'g'), 'version="' + src.info.version + '"'));

    fs.writeFileSync(bootstrap,
                     "window.th_panel = {" + "LAYOUT_HTML: '" + doc + "'};" +
                     fs.readFileSync(bootstrap, "utf-8"));

    fs.writeFileSync(js,
        src.js +
        "ripple('bootstrap').bootstrap();"
    );

    utils.collect(_c.DEPLOY + _EXT_DIR, resourceList, function () {
        return true;
    });

    manifestJSON.version = src.info.version;
    manifestJSON.web_accessible_resources = resourceList.map(function (p) {
        return p.replace(path.normalize(_c.DEPLOY + _EXT_DIR + "/"), '');
    });

    fs.writeFileSync(manifest, JSON.stringify(manifestJSON), "utf-8");

    return src;
};
