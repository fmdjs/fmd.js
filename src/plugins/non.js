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
