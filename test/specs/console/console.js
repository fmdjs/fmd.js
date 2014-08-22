/**
 * @fileoverview unit testing for fmd/console
 * @author Edgar
 * @date 130325
 * */

fmd( 'specs/console', ['console'], function( console ){
    describe( 'fmd/console', function(){
        
        it( 'console', function(){
            console('这行是打印日志','info');
            console('这行是出错日志','warn');
        } );
        
    } );
} );
