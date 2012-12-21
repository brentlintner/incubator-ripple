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
    self;

function defaultProperties() {
    return {
        name: null,
        displayName: null,
        emails: [],
        favorite: null,
        organizations: [],
        urls: [],
        phoneNumbers: [],
        birthday: null,
        activities: [],
        addresses: [],
        anniversary: null,
        categories: [],
        faxNumbers: [],
        ims: null,
        news: [],
        nickname: null,
        note: null,
        pagerNumbers: [],
        phoneNUmbers: [],
        photos: [],
        ringtone: null,
        socialNetworks: [],
        urls: [],
        videoChat: []
    };
}

function properties(obj) {
    var prop, newObj = {};
    for (prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            if (typeof obj[prop] !== "function") {
                newObj[prop] = obj[prop];
            }
        }
    }
    return newObj;
}

function Contact(customProperties) {
    var self = this,
        id = null;

    if (!customProperties) { customProperties = {}; }

    delete customProperties.id;
    self.__defineGetter__('id', function () {
        return id;
    });

    utils.mixin(defaultProperties(), self);
    utils.mixin(customProperties, self);

    utils.mixin({
        save: function (success, error) {
            var lastUpdated = self.updated; // hackish

            self.updated = new Date();

            if (!self.id) {
                id = Math.uuid();
                self.__defineGetter__('id', function () {
                    return id;
                });
            }

            event.trigger("webworks-bb10-contact-save", [properties(self), function () {
                success(self);
            }, function (e) {
                self.updated = lastUpdated;
                error(e);
            }]);
        },
        remove: function (success, error) {
            event.trigger("webworks-bb10-contact-remove", [self.id, success, error]);
        },
        clone: function () {
            return new Contact(utils.copy(properties(self)));
        }
    }, self);
};

module.exports = Contact;
