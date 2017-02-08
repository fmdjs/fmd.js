/**
 * @module fmd/config
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170117
 * */


fmd( 'config', ['env','cache','lang'],
    function( env, cache, lang ){
    'use strict';
    
    var configCache = cache.config = {},
        configKeysCache = cache.configKeys = {},
        configRulesCache = cache.configRules = {};
    
    var ANONYMOUS_RULE_PREFIX = '_rule_';
    
    var ruleUid = 0;
    
    
    var applyRule = function( current, key, val, ruleName ){
        
        var rule = configRulesCache[ruleName];

        if ( rule ){
            return rule.call( configCache, current, key, val ) === undefined;
        }

        return false;
    };
    
    
    var config = {
        get: function( key ){

            return configCache[key];
        },
        set: function( options ){

            for ( var key in options ){
                var current = configCache[key],
                    val = options[key],
                    ruleName = configKeysCache[key];
                
                if ( !ruleName || !applyRule( current, key, val, ruleName ) ){
                    configCache[key] = val;
                }
            }
        },
        register: function( o ){
            
            if ( lang.isFunction( o.rule ) ){
                o.name || ( o.name = ANONYMOUS_RULE_PREFIX + ( ruleUid++ ) );
                configRulesCache[o.name] = o.rule;
            }

            if ( configRulesCache[o.name] && ( o.key || o.keys ) ){
                if ( lang.isArray( o.keys ) ){
                    lang.forEach( o.keys, function( key ){
                        configKeysCache[key] = o.name;
                    } );
                } else {
                    configKeysCache[ o.key || o.keys ] = o.name;
                }
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
