/**
 * @module fmd/plugin
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170118
 * */


fmd( 'plugin', ['cache','lang','event','config','when','remote'],
    function( cache, lang, event, config, when, remote ){
    'use strict';
    
    var pluginCache = cache.plugin = {};
    
    var rPlugin = /(.+)!(.+)/;

    
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
        key: 'plugin',
        rule: function( current, key, val ){
            
            val = !!val;
            
            if ( current === val ){
                return;
            }
            
            this.plugin = val;
            
            if ( val === true ){
                event.on( 'analyze', onAnalyze );
                remote.bring = router;
            } else {
                event.off( 'analyze', onAnalyze );
                remote.bring = remote.get;
            }
        }
    })
    .set({
        plugin: true
    });
    
    
    return plugin;
    
} );
