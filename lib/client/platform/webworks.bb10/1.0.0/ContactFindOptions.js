/*
 *  Copyright 2012 Research In Motion Limited.
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

// TODO: Change these to the actual values
var CONST = {
    SEARCH_FIELD_GIVEN_NAME: 1,
    SEARCH_FIELD_FAMILY_NAME: 2,
    SEARCH_FIELD_ORGANIZATION_NAME: 3,
    SEARCH_FIELD_PHONE: 4,
    SEARCH_FIELD_EMAIL: 5,
    SEARCH_FIELD_BBMPIN: 6,
    SEARCH_FIELD_LINKEDIN: 7,
    SEARCH_FIELD_TWITTER: 8,
    SEARCH_FIELD_VIDEO_CHAT: 9,
    SORT_FIELD_GIVEN_NAME: 10,
    SORT_FIELD_FAMILY_NAME: 11,
    SORT_FIELD_ORGANIZATION_NAME: 12
};

function ContactFindOptions() {}

Object.keys(CONST).forEach(function (key) {
    ContactFindOptions.__defineGetter__(key, function () {
        return CONST[key];
    });
});


module.exports = ContactFindOptions;
