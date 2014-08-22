/**
 * @fileoverview unit testing for fmd/boot
 * @author Edgar
 * @date 130308
 * */

describe( 'fmd/boot', function(){

    describe( 'fmd关键字', function(){
        it( '存在关键字fmd', function(){
            expect(fmd).toBeTruthy();
        } );
    } );
    
    describe( 'fmd定义模块', function(){
        it( '一经定义，即刻执行', function(){
            var a, c;
            
            fmd( 'specs/boot/a', function(){
                a = 'a';
            } );
            
            expect(a).toEqual('a');
            
            fmd( 'specs/boot/b', function(){
                return 'b';
            } );
            
            fmd( 'specs/boot/c', ['specs/boot/b'], function(B){
                c = B + 'c';
            } );
            
            expect(c).toEqual('bc');
        } );
        
        it( '重复定义，只取前者', function(){
            var a;
            
            fmd( 'specs/boot/d', function(){
                return 'a';
            } );
            
            fmd( 'specs/boot/d', function(){
                return 'b';
            } );
            
            fmd( 'specs/boot/e', ['specs/boot/d'], function(D){
                a = D;
            } );
            
            expect(a).toEqual('a');
        } );
    } );
    
    describe( '内置模块', function(){
        it( 'built-in module global', function(){
            var a;
            fmd( 'specs/boot/f', ['global'], function( global ){
                a = global;
            } );
            
            expect(a).toEqual(window);
        } );
        
        it( 'built-in module require', function(){
            var a;
            fmd( 'specs/boot/g', function(){
                return 'specs-boot-g';
            } );
            fmd( 'specs/boot/h', ['require'], function( require ){
                a = require('specs/boot/g');
            } );
            
            expect(a).toEqual('specs-boot-g');
        } );
        
        it( 'built-in module env', function(){
            var a;
            fmd( 'specs/boot/j', ['env'], function( env ){
                a = env;
            } );
            
            expect(a).toEqual(fmd);
        } );
        
        it( 'built-in module cache', function(){
            var a;
            fmd( 'specs/boot/i', ['cache'], function( cache ){
                a = cache;
            } );
            
            expect(a).toEqual(fmd.cache);
        } );
    } );
    
} );
