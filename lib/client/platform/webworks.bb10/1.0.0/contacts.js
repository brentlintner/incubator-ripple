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

// TODO: This module could of been in a better way..
//        i.e. With (?) a generic contacts module (with only one-way communication via events)
//       So.. yeah, creating one, at some point.. would be ideal, you know.

var Contact = ripple('platform/webworks.bb10/1.0.0/Contact'),
    ContactName = ripple('platform/webworks.bb10/1.0.0/ContactName'),
    ContactError = ripple('platform/webworks.bb10/1.0.0/ContactError'),
    ContactField = ripple('platform/webworks.bb10/1.0.0/ContactField'),
    utils = ripple('utils'),
    event = ripple('event'),
    db = ripple('db'),
    defaultContacts = [{
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("Gadget, Inspector"),
        "displayName": "Inspector Gadget",
        "emails": [new ContactField("work", "gadget@topsecret.com", false)]
    }],
    CONTACTS_BB10 = "webworks-bb10-contacts";

function raiseError(callback, code, msg) {
    if (!callback) { return; }
    var e = new ContactError();
    e.code = code;
    e.message = msg;
    callback(e);
}

// this could be done a lot better..?
function filtered(compare, opts) {
    var found = false;

    if (!opts.filter || opts.filter === "") {
        found = true;
    } else if (typeof compare === "string" &&
              compare.match(new RegExp(".*" + opts.filter + ".*", "i"))) {
        found = true;
    } else if (typeof compare === "object" || compare instanceof Array) {
        utils.forEach(compare, function (value) {
            if (!found) {
                found = filtered(value, opts);
            }
        });
    }

    return found;
}

function get() {
    var contactsDB = db.retrieveObject(CONTACTS_BB10),
        loadFromDefaults = contactsDB ? false : true,
        contacts;

    function intoContactObj(properties) {
        var contact = new Contact(properties);

        contact.__defineGetter__('id', function () {
            return properties.id;
        });

        if (loadFromDefaults) { contact.updated = new Date(); }

        return contact;
    }

    console.log(contactsDB);

    contacts = (contactsDB || defaultContacts).map(intoContactObj);

    if (loadFromDefaults) { save(contacts); }

    return contacts;
}

function create(properties) {
    return new Contact(properties);
}

function save(contacts) {
    db.saveObject(CONTACTS_BB10, contacts);
}

function find(fields, opts, success, error) {
    var foundContacts = [],
        tempContact = create(),
        contacts = get(),
        errorFlag = false;

    opts = opts || {};

    // not a fan of error handling at the moment
    if (!fields || !("forEach" in fields)) {
        errorFlag = true;
        raiseError(error, ContactError.INVALID_ARGUMENT_ERROR, "missing contact fields array");
        return;
    }

    fields.forEach(function (prop) {
        if (!(tempContact.hasOwnProperty(prop))) {
            errorFlag = true;
            raiseError(error, ContactError.INVALID_ARGUMENT_ERROR, "invalid contact field (" + prop + ")");
        }
    });

    if (typeof success !== "function" && !errorFlag) {
        errorFlag = true;
        raiseError(error, ContactError.INVALID_ARGUMENT_ERROR, "missing success callback");
    }

    if (errorFlag) {
        return;
    }

    if (fields.length > 0) {
        contacts.forEach(function (contact) {
            var newContact = utils.copy(contact);

            if (opts && (!filtered(contact, opts) ||
                    opts.updatedSince && contact.updated && contact.updated.getTime() < opts.updatedSince.getTime())) {
                return;
            }

            utils.forEach(newContact, function (value, prop) {
                if (typeof newContact[prop] !== "function" && prop !== "id" &&
                    !fields.some(function (field) {
                        return field === prop;
                    })) {
                    delete newContact[prop];
                }
            });

            foundContacts.push(newContact);
        });
    }

    // TODO: don't loop over entire db just to slice the array
    if (opts.multiple === false) {
        foundContacts = foundContacts.splice(0, 1);
    }
    success(foundContacts);
}

// Register for events on require...
(function () {
    event.on("webworks-bb10-contact-save", function (contactProperties, success) {
        var contacts = get(),
            existsIndex = contacts.reduce(function (result, value, index) {
                return value.id && (value.id === contactProperties.id) ? index : result;
            }, -1),
            contact = existsIndex >= 0 ? contacts[existsIndex] : {};

        utils.mixin(contactProperties, contact);

        if (existsIndex < 0) {
            contacts.push(contact);
        }

        save(contacts);
        success();
    });

    event.on("webworks-bb10-contact-remove", function (id, success, error) {
        if (!id) {
            // TODO: Correct error?
            raiseError(error, ContactError.PENDING_OPERATION_ERROR, "id is falsy (" + id + ")");
        } else {
            var contacts = get(),
                toDelete = contacts.reduce(function (result, current, index) {
                    return current.id && (current.id === id) ? index : result;
                }, -1);

            if (toDelete >= 0) {
                contacts.splice(toDelete, 1);
                save(contacts);
                success();
            } else {
                // TODO: correct error?
                raiseError(error, ContactError.PENDING_OPERATION_ERROR, "could not find contact with id (" + id + ")");
            }
        }
    });
}());

module.exports = {
    create: create,
    find: find,
    getContact: function (id) {
        return get().reduce(function (prev, curr) {
            return curr.id && (curr.id === id) ? curr : prev;
        }, null);
    }
};
