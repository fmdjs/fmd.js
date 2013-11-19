/**
 * @fileoverview unit testing for fmd/use
 * @author Edgar
 * @date 130129
 * */

describe( 'fmd/use', function(){
    
    describe( 'require.use', function(){
        it( '异步使用模块', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/use/a', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-use-a');
            });
        } );
        
        it( '无异步使用模块', function(){
            var a;
            
            //runs(function(){
                define(['require'],function(require){
                    require.use( [], function(A){
                        a = 'gju0y6t';
                    } );
               } );
            //});
            
            //waitsFor(function(){
            //    return !!a;
            //});
            
            //runs(function(){
                expect(a).toEqual('gju0y6t');
            //});
        } );
        
        it( '异步使用模块，无回调', function(){
            window.specsUseO = 0;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/use/o' );
                } );
            });
            
            waitsFor(function(){
                return window.specsUseO;
            });
            
            runs(function(){
                expect(window.specsUseO).toEqual(1);
            });
        } );
        
        it( '重复异步使用模块', function(){
            var a, b, c;
            
            window.specsUseB = 0;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/use/b', function(A){
                        a = A;
                    } );
                    require.use( ['specs/use/b','specs/use/c'], function(A,B){
                        b = A;
                        c = B;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual(1);
                expect(b).toEqual(1);
                expect(c).toEqual('specs-use-c');
            });
        } );
        
        it( '使用已存在的模块', function(){
            var a;
            
            define('specs/use/aa',function(){ return 'specs-use-aa'; });
            
            define(['require'], function(require){
                require.use( 'specs/use/aa', function(A){
                    a = A;
                } );
            });
            
            expect(a).toEqual('specs-use-aa');
        } );
        
        it( '不能使用关键模块', function(){
            var a = false, b;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( ['module','specs/use/d'], function(A,B){
                        a = A === null;
                        b = B;
                    } );
                });
            });
            
            waitsFor(function(){
                return typeof a === 'boolean' && !!b;
            });
            
            runs(function(){
                expect(a).toBe(true);
                expect(b).toEqual('specs-use-d');
            });
        } );
        
        it( '使用别名模块', function(){
            var a, b;
            
            define('specs/use/bb',function(){ return 'specs-use-bb'; });
            
            fmd.config({
                alias: {
                    'utrequirealiashas': 'specs/use/bb',
                    'utrequirealiasnth': 'specs/use/l'
                }
            });
            
            runs(function(){
                define(['require'],function(require){
                    require.use(['utrequirealiashas','utrequirealiasnth'],function(A,B){
                        a = A;
                        b = B;
                    });
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('specs-use-bb');
                expect(b).toEqual('specs-use-l');
            });
        } );
        
        it( '使用相对路径', function(){
            var a,b;
            
            define('specs/use/p',['require'],function(require){
                require.use(['./p1','./p2'],function(A,B){
                    a = A;
                    b = B;
                });
            });
            
            runs(function(){
                define(['specs/use/p'],function(){});
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('specs-use-p1');
                expect(b).toEqual('specs-use-p2');
            });
        } );
    } );
    
    describe( 'require.use支持循环依赖', function(){
        it( '二度依赖', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/use/k', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('k1k');
            });
        } );
        
        it( '多度依赖', function(){
            var a, b, c;
            // e > f1 > f
            // f22> f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                define( ['require'], function( require ){
                    require.use( ['specs/use/f','specs/use/g','specs/use/h'], function( A, B, C ){
                        a = A;
                        b = B;
                        c = C;
                    } );
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('e1ef1ghi-f21f2f');
                expect(b).toEqual('e1ef1g1g');
                expect(c).toEqual('ghi-f21h');
            });
        } );
        
        it( '间接异步依赖', function(){
            var a;
            
            define('specs/use/m',['specs/use/m1','specs/use/n'],function(A,B){
                return A+'m'+B;
            });
            
            define('specs/use/n',['specs/use/n1'],function(A){
                return A+'n';
            });
            
            runs(function(){
                define(['require'],function(require){
                    require.use(['specs/use/m'],function(A){
                        a = A;
                    });
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('m1mn1n');
            });
        } );
    } );
} );
