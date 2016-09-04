if (!window.PRVD) {
    window.PRVD = {};
}
if (!window.PRVD.helper) {
    window.PRVD.helper = {};
}

function assertNamespaces() {
    var i;
    var j;
    var ns;
    var node;
    var nodes;
    for (i = 0; i < arguments.length; i += 1) {
        ns = arguments[i];
        node = window;
        nodes = ns.split('.');
        for (j = 0; j < nodes.length; j += 1) {
            if (node[nodes[j]] === undefined) {
                node[nodes[j]] = {};
            }
            node = node[nodes[j]];
        }
    }
}
window.PRVD.helper.bindRoutes = (function() {
    return function(routes, callbacks) {
        var i = 0,
            n = routes.length;
        var route, callback;
        for (; i < n; i += 1) {
            route = routes[i];
            callback = getCallback(route.fn, callbacks);
            bind(route, callback)
        }
    };

    function bind(route, cb) {
        // TODO: route.fn as an array to handle multiple events on the same selector.
        var $el = $(route.el);
        var args = [cb.eventName];
        route.sel && args.push(route.sel);
        args.push(cb);
        $el.on.apply($el, args);
    }

    function getCallback(path, callbacks) {
        var cb;
        (function loop(keys, obj) {
            var key = keys.shift();
            obj = obj[key];
            obj === undefined && raise(path + ': "' + key + '" is undefined');
            typeof obj === 'function' ?
                (cb = obj, cb.eventName = key) :
                loop(keys, obj);
        }(path.split('.'), callbacks));
        return cb;
    }

    function raise(e) {
        throw e;
    }
}());
