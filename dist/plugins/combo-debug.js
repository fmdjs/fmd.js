/**
 * @module fmd/combo
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131010
 * */


fmd( 'combo', ['cache','lang','event','config','module','assets','plugin','when','loader','preload'],
    function( cache, lang, event, config, Module, assets, plugin, when, loader, preload ){
    'use strict';
    
    /**
     * Thanks to:
     * seajs-combo, https://github.com/seajs/seajs-combo/blob/master/src/seajs-combo.js
     * */
     
    var comboCache = cache.combo = {};
    
    var PLUGIN_ASYNC = 'async',
        PLUGIN_NON = 'non',
        PLUGIN_COMBO = '_combo',
        PLUGIN_COMBO_NON = '_combo_non',
        COMBO_SYNTAX = 'comboSyntax',
        COMBO_MAX_LENGTH = 'comboMaxLength',
        EVENT_FETCH = 'fetch';
    
    var rStyle = /\.css(?:\?|$)/i,
        rSplitUrl = /((?:[\w]+)\:\/\/(?:[\w|\.|\:]+)\/)(.+)/i;
    
    var comboSyntax = ['??', ','],
        comboMaxLength = 1500;
    
    
    var isComboUrl = function( url ){
        
        var start = comboSyntax[0],
            bound = comboSyntax[1];
            
        return ( start && url.indexOf( start ) > 0 ) || ( bound && url.indexOf( bound ) > 0 );
    },
    
    getExt = function( url ){
        
        return url.substring( url.lastIndexOf('.') );
    },
    
    splitUrl = function( url, asset ){
        
        var result = url.match( rSplitUrl );
        
        asset._host = result[1];
        asset._path = result[2];
    },
    
    makeId = function( asset ){
        
        var url = asset.url.split('?fmd.stamp')[0],
            ext = getExt( url );
            
        splitUrl( url, asset );
        
        return [ ext, asset._host ].join('_');
    },
    
    pushGroup = function( meta, group ){
        
        if ( meta.included.length > 1 || meta.plugin === PLUGIN_COMBO_NON ){
            event.emit( 'stamp', meta );
            comboCache[meta.url] = meta;
            group.push( meta );
        } else {
            var asset = meta.included[0];
            delete asset.requested;
        }
    },
    
    makeUrl = function( meta, asset ){
        return meta.url + comboSyntax[ meta.url === asset._host ? 0 : 1 ] + asset._path;
    };
    
    
    var onFetch = function( group ){
        
        if ( group.length < 2 ){
            return;
        }
        
        config.get( COMBO_SYNTAX ) && ( comboSyntax = config.get( COMBO_SYNTAX ) );
        config.get( COMBO_MAX_LENGTH ) && ( comboMaxLength = config.get( COMBO_MAX_LENGTH ) );
        
        var asset, mod, needComboGroup = [];
        
        for ( var i = 0; i < group.length; i++ ){
            asset = group[i];
            
            if ( !( asset.plugin === PLUGIN_ASYNC || asset.plugin === PLUGIN_NON ) || asset.comboed || asset.state || asset.preState  ){
                continue;
            }
            
            if ( rStyle.test( asset.url ) && !isComboUrl( asset.url ) ){
                needComboGroup.push( asset );
                continue;
            }
            
            if ( asset.url === asset.id ){
                mod = Module.get( asset.id );
                
                if ( mod && !mod.compiled ){
                    lang.forEach( mod.deps, function( id ){
                        group.push( assets.make( id, mod ) );
                    } );
                }
                
                continue;
            }
            
            if ( !isComboUrl( asset.url ) ){
                needComboGroup.push( asset );
            }
        }
        
        if ( needComboGroup.length ){
            extract( needComboGroup, group );
        }
    },
    
    extract = function( needComboGroup, group ){
        
        var id, meta, comboUrl, cacheId,
            cache = {};
        
        var makeMeta = function( id, asset ){
            
            var meta = cache[id] = {
                url: asset._host,
                plugin: PLUGIN_COMBO,
                included: []
            };
            
            return meta;
        };
        
        lang.forEach( needComboGroup, function( asset ){
            
            id = makeId( asset );
            meta = cache[id] || makeMeta( id, asset );
            
            comboUrl = makeUrl( meta, asset );
            
            if ( comboUrl.length > comboMaxLength ){
                pushGroup( meta, group );
                delete cache[id];
                
                meta = makeMeta( id, asset );
                comboUrl = makeUrl( meta, asset );
            }
            
            meta.url = comboUrl;
            meta.included.push( asset );
            if ( asset.plugin === PLUGIN_NON ){
                meta.plugin = PLUGIN_COMBO_NON;
                asset.plugin = PLUGIN_ASYNC;
            }
            asset.comboed = true;
            asset.requested = true;
        } );
        
        for ( cacheId in cache ){
            pushGroup( cache[cacheId], group );
        }
    },
    
    complete = function( meta ){
        
        lang.forEach( meta.included, function( asset ){
            event.emit( 'requestComplete', asset );
        } );
    };
    
    
    var comboExecute = function( callback ){
        
        when.apply( null, lang.map( this.group, function( meta ){
            return function( promise ){
                
                loader( meta, function(){
                    
                    complete( meta );
                    promise.resolve();
                } );
            };
        } ) ).then( callback );
    },
    
    comboNonExecute = function( callback ){
        
        var group = this.group;
        
        preload( group, function(){
            
            lang.forEach( group, function( meta ){
                complete( meta );
            } );
            
            callback();
        } );
    };
    
    
    config.register({
        keys: 'combo',
        rule: function( current, key, val ){
            
            val = !!val;
            
            if ( current === val ){
                return;
            }
            
            this.combo = val;
            
            if ( val === true ){
                event.on( EVENT_FETCH, onFetch );
                plugin.register( PLUGIN_COMBO, comboExecute );
                plugin.register( PLUGIN_COMBO_NON, comboNonExecute );
            } else {
                event.off( EVENT_FETCH, onFetch );
                plugin.register( PLUGIN_COMBO, null );
                plugin.register( PLUGIN_COMBO_NON, null );
            }
        }
    })
    .set({
        combo: true
    });
    
} );
