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
var utils = ripple('utils'),
    event = ripple('event'),
    propertiesSpec = [
    ],
    self;

function allProperties(obj) {
    var prop, newObj = {};
    for (prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            if (typeof obj[prop] !== "function") {
                newObj[prop] = utils.copy(obj[prop]);
            }
        }
    }
    return newObj;
}

function Contact(properties) {
    var self = this;

    if (!properties) { properties = {}; }

    Object.defineProperty(self, "id", {
        value: properties.id || Math.uuid(),
        enumerable: true
    });

    utils.mixin(properties, self);

    utils.mixin({
        save: function (success, error) {
            var lastUpdated = self.updated; // hackish

            self.updated = new Date();

            if (!self.id) {
                self.id = Math.uuid(undefined, 16);
            }

            event.trigger("webworks-bb10-contact-save", [allProperties(self), success, function (e) {
                _self.updated = lastUpdated;
                error(e);
            }]);
        },
        remove: function (success, error) {
            event.trigger("webworks-bb10-contact-remove", [self.id, success, error]);
        },
        clone: function () {
            var copy = utils.copy(self);
            copy.id = null;
            return copy;
        }
    }, self);
};

module.exports = Contact;
