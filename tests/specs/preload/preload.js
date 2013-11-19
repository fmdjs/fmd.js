/**
 * @fileoverview unit testing for fmd/preload
 * @author Edgar
 * @date 131017
 * */

fmd( 'specs/preload', ['assets','preload'], function( assets, preload ){
    describe( 'fmd/preload', function(){
        
        it( '并行加载，顺序执行', function(){
            var a, a1, a2;
            
            runs(function(){
                preload( assets.group({deps:['specs/preload/a','specs/preload/a1','specs/preload/a2']}), function(){
                    a = window.specsPreloadA;
                    a1 = window.specsPreloadA1;
                    a2 = window.specsPreloadA2;
                } );
            });
            
            waitsFor(function(){
                return !!a2;
            });
            
            runs(function(){
                expect(a.a1).toEqual('specs-preload-a1');
                expect(a.a2).toEqual('specs-preload-a2');
                expect(a1).toEqual(27);
                expect(a2).toEqual(99);
            });
        } );
        
        it( '重复并行加载', function(){
            var a, b, c, d, e, f, g;
            
            runs(function(){
                preload( assets.group({deps:['specs/preload/b','specs/preload/b1']}), function(){
                    a = window.specsPreloadB.b;
                    b = window.specsPreloadB.b1;
                    c = window.specsPreloadB1;
                } );
                
                preload( assets.group({deps:['specs/preload/b','specs/preload/b1','specs/preload/b2']}), function(){
                    d = window.specsPreloadB.b;
                    e = window.specsPreloadB1;
                    f = window.specsPreloadB.b2;
                    g = window.specsPreloadB2;
                } );
            });
            
            waitsFor(function(){
                return !!c && !!g;
            });
            
            runs(function(){
                expect(a).toEqual(976);
                expect(b).toEqual('specs-preload-b1');
                expect(c).toEqual(1000);
                expect(d).toEqual(976);
                expect(e).toEqual(1000);
                expect(f).toEqual('specs-preload-b2');
                expect(g).toEqual(1275);
            });
        } );
    } );
} );
