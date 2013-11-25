/*! fmd.js v0.2.0 | http://fmdjs.org/ | MIT */
/**
 * @module fmd/boot
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131124
 * */


(function( global ){
    'use strict';
    
    if ( global.fmd ){
        return;
    }
    
    
    var partsCache = {},
        parts = [];
    
    var require = function( id ){
        
        return partsCache[id];
    },
    
    fmd = function( id, deps, factory ){
        
        if ( partsCache[id] ){
            return;
        }
        
        if ( !factory ){
            factory = deps;
            deps = [];
        }
        
        if ( 'function' === typeof factory ){
            var args = [];
            
            for ( var i = 0, l = deps.length; i < l; i++ ){
                args.push( require( deps[i] ) );
            }
            
            factory = factory.apply( null, args );
        }
        
        partsCache[id] = factory || 1;
        parts.push( id );
        
    };
    
    
    fmd.version = '0.2.0';
    
    fmd.cache = {
        parts: parts
    };
    
    
    fmd( 'global', global );
    
    fmd( 'require', function(){
        
        return require;
    } );
    
    fmd( 'env', function(){
        
        return fmd;
    } );
    
    fmd( 'cache', function(){
        
        return fmd.cache;
    } );
    
    
    global.fmd = fmd;
    
})( this );


/**
 * @module fmd/lang
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131009
 * */


fmd( 'lang', function(){
    'use strict';
    
    var toString = {}.toString,
        AP = Array.prototype;
    
    var lang = {
        isFunction: function( it ){
            return toString.call( it ) === '[object Function]';
        },
        
        isArray: Array.isArray || function( it ){
            return toString.call( it ) === '[object Array]';
        },
        
        isString: function( it ){
            return typeof it === 'string';
        },
        
        forEach: AP.forEach ?
            function( arr, fn, context ){
                arr.forEach( fn, context );
            } :
            function( arr, fn, context ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    fn.call( context, arr[i], i, arr );
                }
            },
            
        map: AP.map ? function( arr, fn, context ){
                return arr.map( fn, context );
            } : 
            function( arr, fn, context ){
                var ret = [];
                
                lang.forEach( arr, function( item, i, arr ){
                    ret.push( fn.call( context, item, i, arr ) );
                } );
                
                return ret;
            },
        inArray: AP.indexOf ? 
            function( arr, item ){
                return arr.indexOf( item );
            } :
            function( arr, item ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    if ( arr[i] === item ){
                        return i;
                    }
                }
                
                return -1;
            }
    };
    
    
    return lang;
    
} );


/**
 * @module fmd/event
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131015
 * */


fmd( 'event', ['env','cache'],
    function( env, cache ){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, http://seajs.org/
     * */
    
    var eventsCache = cache.events = {},
        slice = [].slice;
    
    var event = {
        on: function( name, callback ){
            
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        
        emit: function( name ){
            
            var args = slice.call( arguments, 1 ),
                list = eventsCache[name],
                fn, i = 0;
            
            if ( list ){
                while ( ( fn = list[i++] ) ){
                    fn.apply( null, args );
                }
            }
        },
        
        off: function( name, callback ){
            
            var list = eventsCache[name];
            
            if ( list ){
                if ( callback ){
                    for ( var i = list.length - 1; i >= 0; i-- ){
                        ( list[i] === callback ) && list.splice( i, 1 );
                    }
                } else {
                    delete eventsCache[name];
                }
            }
        }
    };
    
    
    /* exports API to fmd */
    env.on = event.on;
    env.off = event.off;
    
    
    return event;
    
} );


/**
 * @module fmd/config
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131022
 * */


fmd( 'config', ['env','cache','lang'],
    function( env, cache, lang ){
    'use strict';
    
    var configCache = cache.config = {},
        rulesCache = cache.configRules = {};
    
    var ANONYMOUS_RULE_PREFIX = '_rule_';
    
    var ruleUid = 0;
    
    
    var applyRules = function( current, key, val ){
        
        var hasApply = false,
            item;

        for ( var name in rulesCache ){
            if ( !hasApply ){
                item = rulesCache[name];
                hasApply = lang.inArray( item.keys, key ) > -1 && ( item.rule.call( configCache, current, key, val ) === undefined );
            } else {
                break;
            }
        }
        
        return hasApply;
    };
    
    
    var config = {
        get: function( key ){
            return configCache[key];
        },
        set: function( options ){
            for ( var key in options ){
                var current = configCache[key],
                    val = options[key];
                
                if ( !applyRules( current, key, val ) ){
                    configCache[key] = val;
                }
            }
        },
        register: function( o ){
            
            var item;
            
            if ( lang.isFunction( o.rule ) ){
                o.name || ( o.name = ANONYMOUS_RULE_PREFIX + ( ruleUid++ ) );
                
                item = rulesCache[o.name] = {
                    rule: o.rule,
                    keys: []
                };
            }
            
            item || ( item = rulesCache[o.name] );
            
            if ( item && o.keys ){
                lang.isArray( o.keys ) ?
                    ( item.keys = item.keys.concat( o.keys ) ) :
                    item.keys.push( o.keys );
            }
            
            return this;
        }
    };
    
    
    /* default config rule */
    config.register({
        name: 'object',
        rule: function( current, key, val ){
            
            if ( current ){
                for ( var i in val ){
                    current[i] = val[i];
                }
                return;
            }
            
            return false;
        }
    })
    .register({
        name: 'array',
        rule: function( current, key, val ){
            
            current ? current.push( val ) : ( this[key] = [val] );
        }
    });
    
    
    /* exports API to fmd */
    env.config = function( options ){
        
        if ( lang.isString( options ) ){
            return config.get( options );
        }
        
        config.set( options );
    };
    
    
    return config;
    
} );


/**
 * @module fmd/module
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 131111
 * */


fmd( 'module', ['global','env','cache','lang','event'],
    function( global, env, cache, lang, event ){
    'use strict';
    
    /**
     * Thanks to:
     * RequireJS, http://requirejs.org/
     * SeaJS, http://seajs.org/
     * cujo.js, http://cujojs.com/
     * HexJS, http://hexjs.edgarhoo.org/
     * */
     
    var EMPTY_ID = '',
        EMPTY_DEPS = [],
        ANONYMOUS_PREFIX = '_!_fmd_anonymous_',
        UNDEFINED;
        
    var anonymousUid = 0;
    
    var modulesCache = cache.modules = {};
    
    
    /**
     * key-modules
     * */
    var keyModules = {
        'require': function( mod ){
            
            mod.require || Module.makeRequire( mod );
            
            event.emit( 'makeRequire', mod.require, mod );
            
            return mod.require;
        },
        'exports': function( mod ){
            
            return mod.exports;
        },
        'module': function( mod ){
            
            mod.module = {
                id: mod.id,
                exports: mod.exports
            };
            
            return mod.module;
        }
    };
    
    
    /**
     * module constructor
     * @param {string} module id
     * @param {array} module's dependencies
     * @param {object} module factory
     * */
    var Module = function( id, deps, factory ){
        
        var mod = this;
        
        mod.id = id;
        mod.deps = deps || [];
        mod.factory = factory;
        mod.exports = {};
        
        if ( mod.unnamed() ){
            id = ANONYMOUS_PREFIX + anonymousUid;
            anonymousUid++;
        }
        
        mod.uid = id;
    };
    
    
    Module.prototype = {
        
        unnamed: function(){
            
            return this.id === EMPTY_ID;
        },
        
        extract: function(){
            
            var mod = this,
                deps = mod.deps,
                list = [];
            
            if ( lang.isArray( deps ) ){
                lang.forEach( deps, function( id ){
                    var mid, hook;
                    if ( hook = keyModules[id] ){
                        mid = hook( mod );
                    } else {
                        mod.require || Module.makeRequire( mod );
                        mid = mod.require( id );
                    }
                    
                    list.push( mid );
                } );
            }
            
            return list;
        },
        
        compile: function(){
            
            var mod = this;
            
            try {
                if ( lang.isFunction( mod.factory ) ){
                    
                    var deps = mod.extract(),
                        exports = mod.factory.apply( null, deps );
                        
                    if ( exports !== UNDEFINED ){
                        mod.exports = exports;
                    } else {
                        mod.module && mod.module.exports && ( mod.exports = mod.module.exports );
                    }
                    
                    mod.module && ( delete mod.module );
                    
                } else if ( mod.factory !== UNDEFINED ) {
                    mod.exports = mod.factory;
                }
                
                event.emit( 'compiled', mod );
            } catch ( ex ){
                event.emit( 'compileFailed', ex, mod );
            }
        },
        
        autocompile: function(){
            
            this.unnamed() && this.compile();
        }
    };
    
    
    Module.get = function( id ){
        
        return modulesCache[id];
    };
    
    Module.has = function( id, deep ){
        
        if ( keyModules[id] ){
            return true;
        }
        
        var meta = { id: id };
        deep && event.emit( 'alias', meta );
        
        return modulesCache[meta.id] ? true : false;
    };
    
    Module.save = function( mod ){
        
        modulesCache[mod.uid] = mod;
        event.emit( 'saved', mod );
        mod.autocompile();
    };
    
    Module.require = function( id ){
        
        var mod = Module.get( id );
        
        if ( !mod ){
            event.emit( 'requireFailed', { id: id } );
            return null;
        }
        
        if ( !mod.compiled ){
            mod.compiled = true;
            mod.compile();
        }
        
        event.emit( 'required', mod );
        
        return mod.exports;
    };
    
    Module.makeRequire = function( mod ){
        
        mod.require = function( id ){
            
            var meta = { id: id };
            event.emit( 'relative', meta, mod );
            event.emit( 'alias', meta );
            
            return Module.require( meta.id );
        };
    };
    
    Module.define = function( id, deps, factory ){
        
        var argsLength = arguments.length;
        
        if ( argsLength === 1 ){
            factory = id;
            id = EMPTY_ID;
        } else if ( argsLength === 2 ){
            factory = deps;
            deps = EMPTY_DEPS;
            if ( !lang.isString(id) ){
                deps = id;
                id = EMPTY_ID;
            }
        }
        
        if ( Module.has( id, true ) ){
            event.emit( 'existed', { id: id } );
            return null;
        }
        
        Module.save( new Module( id, deps, factory ) );
    };
    
    
    /* exports API to fmd */
    var originalDefine = global.define;
    
    env.noConflict = function(){
        global.define = originalDefine;
    };
    
    env.define = global.define = Module.define;
    
    
    return Module;
    
} );


/**
 * @module fmd/relative
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131118
 * */


fmd( 'relative', ['lang','event','module'],
    function( lang, event, Module ){
    'use strict';
    
    var rCwd = /.*\//,
        rDot = /\/\.\//,
        rDoubleDot = /[^\/]+\/\.\.\//;
    
    var relative = {
        cwd: function( id ){
            
            return id.match( rCwd )[0];
        },
        
        isDotStart: function( id ){
            
            return id.charAt(0) === '.';
        },
        
        hasSlash: function( id ){
            
            return id.lastIndexOf('/') > 0;
        },
        
        resolve: function( from, to ){
            
            var id = ( from + to ).replace( rDot, '/' );
            
            while ( id.match( rDoubleDot ) ){
                id = id.replace( rDoubleDot, '' );
            }
            
            return id;
        }
    };
    
    
    event.on( 'relative', function( meta, mod ){
        
        if ( relative.isDotStart( meta.id ) && mod && relative.hasSlash( mod.id ) ){
            mod._cwd || ( mod._cwd = relative.cwd( mod.id ) );
            
            meta.id = relative.resolve( mod._cwd, meta.id );
        }
    } );
    
    
    return relative;
    
} );


/**
 * @module fmd/alias
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131010
 * */


fmd( 'alias', ['config','event'],
    function( config, event ){
    'use strict';
    
    var ALIAS = 'alias';
    
    config.register({
        keys: ALIAS,
        name: 'object'
    });
    
    event.on( ALIAS, function( meta ){
        
        var aliases = config.get( ALIAS ),
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
    } );
    
} );


/**
 * @module fmd/id2url
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'id2url', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    var rAbsolute = /^https?:\/\//i;
    
    var TIME_STAMP = ( new Date() ).getTime(),
        RESOLVE = 'resolve',
        STAMP = 'stamp';
    
    
    config.set({
        baseUrl: (function(){
            var rUrl = /(?:[\w]+)\:\/\/(?:[\w|\.|\:]+)\//i,
                scripts = global.document.getElementsByTagName('script'),
                selfScript = scripts[scripts.length-1],
                selfUrl = ( selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute("src", 4) ).match( rUrl );
            
            return selfUrl[0];
        })()
    });
    
    config.register({
        keys: RESOLVE,
        name: 'array'
    })
    .register({
        keys: STAMP,
        name: 'object'
    });
    
    
    var parseResolve = function( asset ){
            
        var resolve = config.get( RESOLVE ),
            url;
        
        if ( resolve ){
            for ( var i = 0, l = resolve.length; i < l; i++ ){
                url = resolve[i]( asset.id );
                
                if ( url !== asset.id ){
                    break;
                }
            }
        }
        
        asset.url = url ? url : asset.id;
    },
    
    addBaseUrl = function( asset ){
        
        rAbsolute.test( asset.url ) || ( asset.url = config.get('baseUrl') + asset.url );
    },
    
    addExtname = function( asset ){
        
        var url = asset.url;
        
        url.lastIndexOf('.') < url.lastIndexOf('/') && ( asset.url += '.js' );
    },
    
    addStamp = function( asset ){
            
        var t = config.get('hasStamp') ? TIME_STAMP : null,
            stamp = config.get( STAMP );
            
        if ( stamp ){
            for ( var key in stamp ){
                if ( ( new RegExp( key ) ).test( asset.id ) ){
                    t = stamp[key];
                    break;
                }
            }
        }
        
        t && ( asset.url += '?fmd.stamp=' + t );
    },
    
    id2url = function( asset ){
        
        event.emit( RESOLVE, asset );
        
        addBaseUrl( asset );
        addExtname( asset );
        
        event.emit( STAMP, asset );
    };
    
    
    event.on( RESOLVE, parseResolve );
    event.on( STAMP, addStamp );
    event.on( 'id2url', id2url );
    
} );


/**
 * @module fmd/assets
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131014
 * */


fmd( 'assets', ['cache','lang','event','config','module'],
    function( cache, lang, event, config, Module ){
    'use strict';
    
    var assetsCache = cache.assets = {},
        id2urlMap = {};
    
    var assets = {
        make: function( id, meta ){
            
            var asset = { id: id };
            event.emit( 'analyze', asset );
            event.emit( 'relative', asset, meta );
            event.emit( 'alias', asset );
            
            if ( id2urlMap[asset.id] ){
                return assetsCache[ id2urlMap[asset.id] ];
            }
            
            Module.has( asset.id ) ? ( asset.url = asset.id ) : event.emit( 'id2url', asset );
            
            id2urlMap[asset.id] = asset.url;
            
            return ( assetsCache[asset.url] = asset );
        },
        
        group: function( meta ){
            
            return lang.map( meta.deps, function( id ){
                return assets.make( id, meta );
            } );
        }
    };
    
    
    return assets;
    
} );


/**
 * @module fmd/when
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 130419
 * */


fmd( 'when', function(){
    'use strict';
    
    /**
     * Thanks to:
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * jQuery, https://github.com/jquery/jquery/blob/1.7.2/src/deferred.js
     * */
     
    var noop = function(){};
    
    var Promise = function( len ){
        
        var _this = this,
            thens = [],
            resolved = 0,
            rejected = 0;
        
        len = len || 0;

        var probe = function(){
            if ( resolved + rejected === len ){
                complete();
            }
        },
        
        complete = function(){
            _this.then = !rejected ?
                function( resolved, rejected ){ resolved && resolved(); } :
                function( resolved, rejected ){ rejected && rejected(); };
                
            complete = noop;
            
            notify( !rejected ? 0 : 1 );
            
            notify = noop;
            thens = [];
        },
        
        notify = function( which ){
            var then, callback, i = 0;
            
            while ( ( then = thens[i++] ) ){
                callback = then[which];
                callback && callback();
            }
        };
        
        this.then = function( resolved, rejected ){
            thens.push( [resolved, rejected] );
        };
        
        this.resolve = function(){
            resolved++;
            probe();
        };
        
        this.reject = function(){
            rejected++;
            probe();
        };
        
        probe();
    };
    
    
    var when = function(){
        var l = arguments.length,
            promise = new Promise(l),
            fn, i = 0;
        
        while ( ( fn = arguments[i++] ) ){
            fn( promise );
        }
        
        return promise;
    };
    
    
    return when;
    
} );


/**
 * @module fmd/request
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131007
 * */


fmd( 'request', ['global','config','event'],
    function( global, config, event ){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, https://github.com/seajs/seajs/blob/master/src/util-request.js
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/test.html
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/load-css.html
     * YUI3, https://github.com/yui/yui3/blob/v3.13.0/src/get/js/get.js
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * lazyload, https://github.com/rgrove/lazyload/blob/master/lazyload.js
     * RequireJS, https://github.com/jrburke/requirejs/blob/master/require.js
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * curl css! plugin, https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
     * cssx, https://github.com/unscriptable/cssx/blob/master/src/cssx/css.js
     * LABjs, https://github.com/getify/LABjs/blob/2.0/LAB.src.js
     * */
    
    var doc = global.document,
        setTimeout = global.setTimeout;
    
    var rStyle = /\.css(?:\?|$)/i,
        rReadyStates = /loaded|complete/,
        rLoadXdSheetError = /security|denied/i;
    
    var EVENT_REQUESTED = 'requested',
        CHARSET = 'charset';
        
    var isOldWebKit = ( global.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") ) * 1 < 536;
    
    var head = doc && ( doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement );
    
    
    var createNode = function( asset, isStyle ){
        
        var node;
        
        if ( isStyle ){
            node = doc.createElement('link');
            node.rel = 'stylesheet';
            node.href = asset.url;
        } else {
            node = doc.createElement('script');
            node.async = true;
            node.src = asset.url;
        }
        
        config.get( CHARSET ) && ( node.charset = config.get( CHARSET ) );
        
        event.emit( 'createNode', node, asset );
        
        return node;
    },
    
    poll = function( node, callback, asset ){
        
        var isLoaded = false,
            sheet, rules;
        
        try {
            sheet = node.sheet;
            
            if ( sheet ){
                rules = sheet.cssRules;
                isLoaded = rules ? rules.length > 0 : rules !== undefined;
            }
        } catch( ex ){
            isLoaded = rLoadXdSheetError.test( ex.message );
        }
        
        setTimeout( function(){
            if ( isLoaded ){
                callback && callback();
                event.emit( EVENT_REQUESTED, asset );
            } else {
                poll( node, callback, asset );
            }
        }, 20 );
    };
    
    
    var onLoadAsset = function( node, callback, isSupportOnload, asset, isStyle ){
        
        if ( isSupportOnload ){
            node.onload = function(){
                finish();
                event.emit( EVENT_REQUESTED, asset );
            };
            node.onerror = function(){
                finish();
                event.emit( 'requestError', asset );
            };
        } else {
            node.onreadystatechange = function(){
                if ( rReadyStates.test( node.readyState ) ){
                    finish();
                    event.emit( EVENT_REQUESTED, asset );
                }
            };
        }
        
        function finish(){
            node.onload = node.onreadystatechange = node.onerror = null;
            
            if ( !isStyle && !config.get('debug') ){
                node.parentNode && node.parentNode.removeChild( node );
            }
            
            node = undefined;
            
            callback && callback();
        }
    },
    
    onLoadStyle = function( node, callback, isSupportOnload, asset ){
        
        if ( isOldWebKit || !isSupportOnload ){
            setTimeout( function(){
                poll( node, callback, asset );
            }, 1 );
            
            return;
        }
        
        onLoadAsset( node, callback, isSupportOnload, asset, true );
    },
    
    request = function( asset, callback ){
        
        var isStyle = rStyle.test( asset.url ),
            node = createNode( asset, isStyle ),
            isSupportOnload = 'onload' in node;
        
        isStyle ? onLoadStyle( node, callback, isSupportOnload, asset )
                : onLoadAsset( node, callback, isSupportOnload, asset );
        
        head.appendChild( node );
    };
    
    
    return request;
    
} );


/**
 * @module fmd/loader
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131004
 * */


fmd( 'loader', ['global','event','config','request'],
    function( global, event, config, request ){
    'use strict';
    
    var STATE_LOADING = 'loading',
        STATE_LOADED = 'loaded',
        EVENT_REQUEST_COMPLETE = 'requestComplete';
        
    var noop = function(){};
    
    
    config.set({
        timeout: 10000
    });
    
    
    event.on( EVENT_REQUEST_COMPLETE, function( asset ){
        
        var call, queue;
        
        asset.state = STATE_LOADED;
        queue = asset.onload;

        while ( call = queue.shift() ){
            call();
        }
    } );
    
    
    var loader = function( asset, callback ){
        
        callback || ( callback = noop );
        
        if ( asset.state === STATE_LOADED ){
            callback();
            return;
        }
        
        if ( asset.state === STATE_LOADING ){
            asset.onload.push( callback );
            return;
        }
        
        asset.state = STATE_LOADING;
        asset.onload = [callback];
        
        event.emit( 'request', asset, callback );
        
        if ( asset.requested ){
            return;
        }
        
        asset.timer = global.setTimeout( function(){
            event.emit( 'requestTimeout', asset );
        }, config.get('timeout') );
        
        request( asset, function(){
            global.clearTimeout( asset.timer );
            event.emit( EVENT_REQUEST_COMPLETE, asset );
        } );
    };
    
    
    return loader;
    
} );


/**
 * @module fmd/remote
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131112
 * */


fmd( 'remote', ['lang','event','module','assets','when','loader'],
    function( lang, event, Module, assets, when, loader ){
    'use strict';
    
    var remote = {};
    
    remote.bring = remote.get = function( group, callback ){
        
        when.apply( null, lang.map( group, function( asset ){
            return function( promise ){
                
                Module.has( asset.id ) ?
                    promise.resolve() : loader( asset, function(){
                        promise.resolve();
                    } );
            };
        } ) ).then( callback );
    };
        
    remote.fetch = function( meta, callback ){
        
        var group = assets.group( meta );
        
        event.emit( 'fetch', group );
        
        remote.bring( group, function(){
            
            when.apply( null, lang.map( group, function( asset ){
                return function( promise ){
                    
                    var mod = Module.get( asset.id );
                    
                    mod && !mod.compiled && mod.deps.length ? remote.fetch( mod, function(){
                        promise.resolve();
                    } ) : promise.resolve();
                };
            } ) ).then( function(){
                callback.call( null, group );
            } );
        } );
    };
    
    
    return remote;
    
} );


/**
 * @module fmd/use
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'use', ['lang','event','module','remote'],
    function( lang, event, Module, remote ){
    'use strict';
    
    event.on( 'makeRequire', function( require, mod ){
        
        require.use = function( ids, callback ){
            
            lang.isArray( ids ) || ( ids = [ids] );
            
            remote.fetch( { id: mod.id, deps: ids }, function( group ){
                var args = lang.map( group, function( asset ){
                    return Module.require( asset.id );
                } );
                
                callback && callback.apply( null, args );
            } );
        };
    } );
    
} );


/**
 * @module fmd/async
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'async', ['config','module','remote'],
    function( config, Module, remote ){
    'use strict';
    
    var original = Module.prototype.autocompile;
    
    var replacer = function(){
        
        var mod = this;
        
        if ( mod.unnamed() ){
            remote.fetch( mod, function(){
                mod.compile();
            } );
        }
    };
    
    
    config.register({
        keys: 'async',
        rule: function( current, key, val ){
            
            val = !!val;
            
            if ( current !== val ){
                this.async = val;
                Module.prototype.autocompile = val === true ? replacer : original;
            }
        }
    })
    .set({
        async: true
    });
    
} );


/**
 * @module fmd/logger
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131007
 * */


fmd( 'logger', ['global','require','env','config','assets','loader','console'],
    function( global, require, env, config, assets, loader, console ){
    'use strict';
    
    var noop = env.log = function(){},
        sysConsole = global.console;
    
    var createLogger = function( isDebug ){
        
        env.log = isDebug ? ( sysConsole && sysConsole.warn ? function( message, level ){
            sysConsole[ level || 'log' ]( message );
        } : function( message, level ){
            if ( console ){
                console( message, level );
            } else if ( loader ) {
                loader( assets.make('fmd/console'), function(){
                    console || ( console = require('console') );
                    console( message, level );
                } );
            }
        } ) : noop;
    };
    
    
    config.register({
        keys: 'debug',
        rule: function( current, key, val ){
            createLogger( val );
            this.debug = val;
        }
    });
    
} );


/**
 * @module fmd/plugin
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131010
 * */


fmd( 'plugin', ['cache','lang','event','config','when','remote'],
    function( cache, lang, event, config, when, remote ){
    'use strict';
    
    var pluginCache = cache.plugin = {};
    
    var rPlugin = /(.+)!(.+)/;
    
    var ANALYZE = 'analyze';
    
    
    var plugin = {
        defaultPlugin: 'async',
        
        register: function( name, execute ){
            pluginCache[name] = execute;
        },
        
        sorting: function( group ){
            
            var tasks = [],
                flag = {},
                taskIndex,
                task;
            
            lang.forEach( group, function( asset ){
                
                if ( flag[asset.plugin] > -1 ){
                    task = tasks[flag[asset.plugin]];
                } else {
                    taskIndex = flag[asset.plugin] = tasks.length;
                    task = tasks[taskIndex] = {
                        group: [],
                        execute: pluginCache[asset.plugin]
                    };
                }
                
                task.group.push( asset );
            } );
            
            return tasks;
        }
    };
    
    
    /* default plugin */
    plugin.register( plugin.defaultPlugin, function( callback ){
        
        remote.get( this.group, callback );
    } );
    
    
    /* inject plugin */
    var onAnalyze = function( asset ){
        
        var result = asset.id.match( rPlugin );
        
        if ( result ){
            asset.plugin = result[1];
            asset.id = result[2];
        }
        
        !pluginCache[asset.plugin] && ( asset.plugin = plugin.defaultPlugin );
    },
    
    router = function( group, callback ){
        
        when.apply( null, lang.map( plugin.sorting( group ), function( task ){
            return function( promise ) {
                
                task.execute ? task.execute( function(){
                    promise.resolve();
                } ) : promise.resolve();
            };
        } ) ).then( callback );
    };
    
    
    config.register({
        keys: 'plugin',
        rule: function( current, key, val ){
            
            val = !!val;
            
            if ( current === val ){
                return;
            }
            
            this.plugin = val;
            
            if ( val === true ){
                event.on( ANALYZE, onAnalyze );
                remote.bring = router;
            } else {
                event.off( ANALYZE, onAnalyze );
                remote.bring = remote.get;
            }
        }
    })
    .set({
        plugin: true
    });
    
    
    return plugin;
    
} );


/**
 * @module fmd/preload
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131010
 * */


fmd( 'preload', ['global','lang','event','when','request','loader'],
    function( global, lang, event, when, request, loader ){
    'use strict';
    
    /**
     * Thanks to:
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * YUI3, https://github.com/yui/yui3/blob/v3.13.0/src/get/js/get.js
     * lazyload, https://github.com/rgrove/lazyload/blob/master/lazyload.js
     * LABjs, https://github.com/getify/LABjs/blob/2.0/LAB.src.js
     * */
     
    var doc = global.document,
        isSupportAsync = 'async' in doc.createElement('script') || 'MozAppearance' in doc.documentElement.style || global.opera;
    
    var TYPE_CACHE = 'text/cache-javascript',
        STATE_PRELOADING = 'preloading',
        STATE_PRELOADED = 'preloaded';
    
    
    event.on( 'createNode', function( node, asset ){
        
        if ( asset.isPreload ){
            node.async = false;
            node.defer = false;
            
            !isSupportAsync && ( node.type = TYPE_CACHE );
        }
    } );
    
    event.on( 'request', function( asset, callback ){
        
        if ( asset.preState ){
            if ( asset.preState === STATE_PRELOADING ){
                asset.onpreload.push(function(){
                    loader( asset, callback );
                });
                
                delete asset.state;
                asset.requested = true;
            } else {
                delete asset.requested;
                delete asset.isPreload;
            }
        }
    } );
    
    
    var preRequest = function( asset ){
        
        if ( !asset.preState ){
            asset.preState = STATE_PRELOADING;
            asset.onpreload = [];
            
            request( asset, function(){
                
                asset.preState = STATE_PRELOADED;
                lang.forEach( asset.onpreload, function( call ){
                    call();
                } );
            } );
        }
    };
    
    
    var preloadByAsync = function( group, callback ){
        
        when.apply( null, lang.map( group, function( asset ){
            return function( promise ){
                asset.isPreload = true;
                loader( asset, function(){
                    promise.resolve();
                } );
            };
        } ) ).then( callback );
    },
    
    preloadByCache = function( group, callback ){
        
        var rest = group.slice( 1 );
        
        if ( rest.length ){
            lang.forEach( group, function( asset ){
                if ( !asset.isPreload ){
                    asset.isPreload = true;
                    preRequest( asset );
                }
            } );
            
            loader( group[0], function(){
                preload( rest, callback );
            } );
        } else {
            loader( group[0], callback );
        }
    },
    
    preload = function( group, callback ){
        
        preload = isSupportAsync ? preloadByAsync : preloadByCache;
        
        preload( group, callback );
    };
    
    
    return preload;
    
} );


/**
 * @module fmd/non
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'non', ['plugin','preload'],
    function( plugin, preload ){
    'use strict';
    
    plugin.register( 'non', function( callback ){
        
        preload( this.group, callback );
    } );
    
} );
