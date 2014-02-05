/*! fmd.js v0.2.1 | http://fmdjs.org/ | MIT */
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
    
    
    fmd.version = '0.2.1';
    
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
 * @version v0.3.1
 * @date 140205
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
    
    /* sign for FMD */
    Module.define.fmd = {};
    
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
