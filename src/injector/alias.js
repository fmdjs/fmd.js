/**
 * @module fmd/alias
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170105
 * */


fmd( 'alias', ['config','event'],
    function( config, event ){
    'use strict';
    
    config.register({
        keys: 'alias',
        name: 'object'
    });
    
    event.on( 'alias', function( meta ){
        
        var aliases = config.get( 'alias' ),
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
    } );
    
} );
