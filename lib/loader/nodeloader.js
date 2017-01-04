/**
 * @module fmd/nodeloader
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 170104
 * */


fmd( 'nodeloader', ['config', 'module', 'assets'],
    function( config, Module, assets ){
    'use strict';

    Module.makeRequire = function( mod ){

        mod.require = function( id ){

            var asset = assets.make( id, mod );

            Module.has( asset.id ) || require( asset.uri );

            return Module.require( asset.id );
        };
    };

} );
