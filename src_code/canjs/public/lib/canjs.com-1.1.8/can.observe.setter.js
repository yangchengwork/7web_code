/***
 * Excerpted from "Seven Web Frameworks in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/7web for more book information.
***/
/*!
 * CanJS - 1.1.8
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 24 Sep 2013 21:59:55 GMT
 * Licensed MIT
 * Includes: can/observe/setter
 * Download from: http://canjs.com
 */
(function(can) {

    can.classize = function(s, join) {
        // this can be moved out ..
        // used for getter setter
        var parts = s.split(can.undHash),
            i = 0;
        for (; i < parts.length; i++) {
            parts[i] = can.capitalize(parts[i]);
        }

        return parts.join(join || '');
    }

    var classize = can.classize,
        proto = can.Observe.prototype,
        old = proto.__set;

    proto.__set = function(prop, value, current, success, error) {
        // check if there's a setter
        var cap = classize(prop),
            setName = "set" + cap,
            errorCallback = function(errors) {
                var stub = error && error.call(self, errors);

                // if 'setter' is on the page it will trigger
                // the error itself and we dont want to trigger
                // the event twice. :)
                if (stub !== false) {
                    can.trigger(self, "error", [prop, errors], true);
                }

                return false;
            },
            self = this;

        // if we have a setter
        if (this[setName] &&
            // call the setter, if returned value is undefined,
            // this means the setter is async so we 
            // do not call update property and return right away
            (value = this[setName](value, function(value) {
                        old.call(self, prop, value, current, success, errorCallback)
                    },
                    errorCallback)) === undefined) {
            return;
        }

        old.call(self, prop, value, current, success, errorCallback);

        return this;
    };
    return can.Observe;
})(can);