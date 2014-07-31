/**
 * Created by maique.almeida on 29/07/2014.
 */
var RESTResult = RESTResult || function () { this.success = null; this.data = null; this.status = null; this.error = null; }
var RESTError = RESTError || function (code, status, message) { this.code = code; this.status = status, this.message = message };

var SORM = SORM || function (endPointURL) {
    this.URL = endPointURL;

}


SORM.prototype.query = SORM.prototype.query || function (method, data) {
    var _result = new RESTResult();

    var jqXHR = $.ajax({
        url: this.URL,
        type: method,
        data: data,
        async: false,
        cache: false,
        accepts: 'JSON',
        statusCode: {
            404: function () {
                alert("Page not found");
            }
        }
    });

    jqXHR.done(function (data, textStatus, jqXHR) {
        _result.data = data;
        _result.status = textStatus;
        _result.success = true;

    });

    var o = jqXHR.fail(function (jqXHR, textStatus, errorThrown) {

        if (typeof(jqXHR.responseText) != "undefined") {
            var obj = JSON.parse(jqXHR.responseText);
            _result.error = new RESTError(jqXHR.status, jqXHR.statusText, obj.Message);
        }

        _result.data = null;
        _result.status = textStatus;
        _result.success = false;

        return _result;

    });

    jqXHR.always(function (a, b, c) {
    });

    return _result;
};


/** Helper functions **/
var inherit = inherit || function (p) {
    if (p == null) throw TypeError(); // p must be a non-null object
    if (Object.create)                // If Object.create() is defined...
        return Object.create(p);      //    then just use it.
    var t = typeof p;                 // Otherwise do some more type checking
    if (t !== "object" && t !== "function") throw TypeError();
    function f() { };                  // Define a dummy constructor function.
    f.prototype = p;                  // Set its prototype property to p.
    return new f();                   // Use f() to create an "heir" of p.
}

function getObjectClass(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);

        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return undefined;
}