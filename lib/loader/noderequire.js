/**
 * @module fmd/noderequire
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170214
 * */


fmd( 'noderequire', ['config', 'module', 'assets'],
    function( config, Module, assets ){
    'use strict';

    Module.makeRequire = function( mod ){

        mod.require = function( id ){

            var asset = assets.make( id, mod );

            Module.has( asset.id ) || require( asset.url );

            return Module.require( asset.id );
        };
    };

} );
