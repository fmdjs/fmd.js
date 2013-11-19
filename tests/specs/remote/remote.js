/**
 * @fileoverview unit testing for fmd/remote
 * @author Edgar
 * @date 130129
 * */

fmd( 'specs/remote', ['remote'], function(remote){
    describe( 'fmd/remote', function(){
        it( '传空', function(){
            var a,b;
            
            remote.fetch({deps:[]},function(group){
                a = '6ftygui';
                b = group.length;
            });
            
            expect(a).toEqual('6ftygui');
            expect(b).toEqual(0);
        } );
        
        it( '一度依赖', function(){
            
            var a,b,c,d,e,f;
            
            runs(function(){
                var deps = ['specs/remote/a','specs/remote/d','specs/remote/l'];
                remote.fetch( {deps:deps}, function( group ){
                    define(deps,function(A,B,C){
                        a = A;
                        b = B;
                        c = C;
                    });
                    
                    d = group[0].id;
                    e = group[1].id;
                    f = group[2].id;
                } );
            });
            
            waitsFor(function(){
                return !!c && !!f;
            });
            
            runs(function(){
                expect(a).toEqual('specs-remote-a');
                expect(b).toEqual('specs-remote-d');
                expect(c).toEqual('specs-remote-l');
                expect(d).toEqual('specs/remote/a');
                expect(e).toEqual('specs/remote/d');
                expect(f).toEqual('specs/remote/l');
            });
        } );
        
        it( '一度重复依赖', function(){
            var a, b, c;
            
            window.specsRemoteB = 0;
            
            runs(function(){
                remote.fetch({deps:['specs/remote/b']},function(){
                    define(['specs/remote/b'],function(){
                        a = window.specsRemoteB;
                    });
                });
                remote.fetch({deps:['specs/remote/b','specs/remote/c']},function(){
                    define(['specs/remote/b','specs/remote/c'],function(A,B){
                        b = window.specsRemoteB;
                        c = B;
                    });
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual(1);
                expect(b).toEqual(1);
                expect(c).toEqual('specs-remote-c');
            });
        } );
        
        it( '二度依赖', function(){
            var a;
            
            runs(function(){
                remote.fetch({deps:['specs/remote/k']},function(){
                    define(['specs/remote/k'],function(A){
                        a = A;
                    });
                });
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
            // f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                var deps = ['specs/remote/f','specs/remote/g','specs/remote/h'];
                remote.fetch( {deps:deps}, function(){
                    define(deps,function(A,B,C){
                        a = A;
                        b = B;
                        c = C;
                    });
                } );
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
        
        it( '间接二度依赖', function(){
            var a;
            
            define('specs/remote/m',['specs/remote/m1','specs/remote/n'],function(A,B){
                return A+'m'+B;
            });
            
            define('specs/remote/n',['specs/remote/n1'],function(A){
                return A+'n';
            });
            
            runs(function(){
                remote.fetch({deps:['specs/remote/m']},function(){
                    define(['specs/remote/m'],function(A){
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
