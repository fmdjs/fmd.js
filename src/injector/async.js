/**
 * @module fmd/async
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170118
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
        key: 'async',
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
