/**
 * @fileoverview for fmd.js unit testing
 * @author Edgar
 * @date 131009
 * */


fmd.config({
    hasStamp: true,
    plugin: false,
    async: false,
    combo: false,
    resolve: function( id ){
        
        /^specs\//.test( id ) && ( id = 'tests/' + id );
        
        id === 'fmd/console' && ( id = location.pathname.indexOf('dist') ? 'dist/fmd/console' : 'src/console' );
        
        return id;
    },
    debug: (function(){
        
        return location.href.indexOf('debug') > 0 ? true : false;
    })()
});
