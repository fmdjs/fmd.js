/**
 * @fileoverview for fmd.js unit testing
 * @author Edgar
 * @date 131009
 * */


define(function(){
    
    var rRoot = /^specs\//;
    
    /*
    if ( location.pathname.indexOf('tests/runner') > 0 ){
        fmd.config({
            async: true
        });
    }
    
    if ( location.pathname.indexOf('online') > 0 ){
        fmd.config({
            baseUrl: location.protocol + '//' + location.host + '/'
        });
    }
    */
    fmd.config({
        hasStamp: true,
        plugin: false,
        async: false,
        combo: false,
        resolve: function( id ){
            
            rRoot.test( id ) && ( id = 'tests/' + id );
            
            id === 'fmd/console' && ( id = location.pathname.indexOf('dist') ? 'dist/fmd/console' : 'src/console' );
            
            return id;
        },
        debug: (function(){
            
            return location.href.indexOf('debug') > 0 ? true : false;
        })()
    });
    
});
