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
        
        var aliases = config.get(ALIAS),
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
    } );
    
} );
