/**
 * @fileoverview unit testing for fmd/async
 * @author Edgar
 * @date 130419
 * */

describe( 'fmd/async', function(){
    
    describe( 'define支持循环依赖解析', function(){
        var configExplant = fmd.config('async');
        
        beforeEach(function(){
            fmd.config({
                async: true
            });
        });
        
        afterEach(function(){
            fmd.config({
                async: configExplant
            });
        });
        
        it( '一度依赖', function(){
            var a, b, c;
            
            runs(function(){
                define(['specs/async/a','specs/async/b','specs/async/c'], function( A, B, C ){
                    a = A;
                    b = B;
                    c = C;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('a');
                expect(b).toEqual('b');
                expect(c).toEqual('c');
            });
        } );
        
        it( '一、二度依赖', function(){
            var a, b;
            //   > d
            // e1 > e
            runs(function(){
                define(['specs/async/d','specs/async/e'], function( A, B ){
                    a = A;
                    b = B;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('d');
                expect(b).toEqual('e1e');
            });
        } );
        
        it( '多度依赖', function(){
            var a, b, c;
            // e > f1 > f
            // f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                define(['specs/async/f','specs/async/g','specs/async/h'], function( A, B, C ){
                    a = A;
                    b = B;
                    c = C;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('e1ef1f21f2f');
                expect(b).toEqual('e1ef1g1g');
                expect(c).toEqual('f21h');
            });
        } );
        
        it( '别名依赖', function(){
            var a;
            
            fmd.config({
                alias: {
                    'utasyncalias': 'specs/async/i'
                }
            });
            
            runs(function(){
                define(['utasyncalias'],function(A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('i');
            });
        } );
        
        it( '已存在的依赖', function(){
            var a;
            
            define('specs/async/aa',function(){ return 'specs-async-aa';});
            
            runs(function(){
                define(['specs/async/aa'], function(A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-async-aa');
            });
        } );
        
        it( '间接异步依赖', function(){
            var a;
            
            define('specs/async/m',['specs/async/m1','specs/async/n'],function(A,B){
                return A+'m'+B;
            });
            
            define('specs/async/n',['specs/async/n1'],function(A){
                return A+'n';
            });
            
            runs(function(){
                define(['specs/async/m'],function(A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('m1mn1n');
            });
        } );
        
        it( '关键模块依赖', function(){
            var a;
            
            runs(function(){
                define(['specs/async/j'], function(A){
                    a = A.a;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('j1j2j');
            });
        } );
        
    } );
    
} );
