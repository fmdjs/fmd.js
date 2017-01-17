/**
 * @module fmd/alias
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170118
 * */


fmd( 'alias', ['config','event'],
    function( config, event ){
    'use strict';
    
    config.register({
        key: 'alias',
        name: 'object'
    });
    
    event.on( 'alias', function( meta ){
        
        var aliases = config.get( 'alias' ),
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.nominalId = meta.id;
            meta.id = alias;
        }
    } );
    
} );
