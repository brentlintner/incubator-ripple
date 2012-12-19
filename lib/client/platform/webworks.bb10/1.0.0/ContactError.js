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

var CONST = {
    UNKNOWN_ERROR: 0,
    INVALID_ARGUMENT_ERROR: 1,
    TIMEOUT_ERROR: 2,
    PENDING_OPERATION_ERROR: 3,
    IO_ERROR: 4,
    NOT_SUPPORTED_ERROR: 5,
    PERMISSION_DENIED_ERROR: 20
};

function ContactError(code) {
    this.code = code || null;
}


Object.keys(CONST).forEach(function (key) {
    ContactError.__defineGetter__(key, function () {
        return CONST[key];
    });
});

module.exports = ContactError;
