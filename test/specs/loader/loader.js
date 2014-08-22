/**
 * @fileoverview unit testing for fmd/loader
 * @author Edgar
 * @date 130324
 * */

fmd( 'specs/loader', ['assets','loader'], function( assets, loader ){
    describe( 'fmd/loader', function(){
        
        var t = ( new Date() ).getTime();
        
        it( 'load', function(){
            var a;
            
            runs(function(){
                loader( { url: '/test/specs/loader/a.js?'+t }, function(){
                    a = window.specsLoaderA;
                } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-loader-a');
            });
        } );
        
        it( 'load repeat', function(){
            var a, b;
            
            window.specsLoaderB = 0;
            
            runs(function(){
                var meta = {
                    url: '/test/specs/loader/b.js?'+t
                };
                loader( meta, function(){
                    a = window.specsLoaderB;
                });
                loader( meta, function(){
                    b = window.specsLoaderB;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual(1);
                expect(b).toEqual(1);
            });
        } );
        
    } );
} );
