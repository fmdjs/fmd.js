/**
 * @fileoverview unit testing for fmd/request
 * @author Edgar
 * @date 131009
 * */

fmd( 'specs/request', ['request'], function( request ){
    describe( 'fmd/request', function(){
        
        var getStyle = function( node, name ){
            var ret;
            
            if ( window.getComputedStyle ){
                ret = getComputedStyle( node );
            } else {
                ret = node.currentStyle;
            }
            
            return ret[name];
        };
        
        var t = ( new Date() ).getTime();
        
        it( 'request js', function(){
            var a;
            
            runs(function(){
                request( {url:'/test/specs/request/a.js?'+t}, function(){
                    a = window.specsRequestA;
                } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-request-a');
            });
        } );
        
        describe( 'request css', function(){
            var el;
                
            beforeEach(function(){
                el = document.createElement('div');
                el.id = 'specs-request-a';
                document.body.appendChild( el );
            });
            
            afterEach(function(){
                document.body.removeChild( el );
            });
            
            it( 'request css', function(){
                var a;
                
                runs(function(){
                    request( {url:'/test/specs/request/a.css?'+t}, function(){
                        setTimeout(function(){
                            a = getStyle( el, 'color');
                        },200);
                    } );
                });
                
                waitsFor(function(){
                    return !!a;
                });
                
                runs(function(){
                    expect(a==='rgb(144, 40, 71)'||a==='#902847').toEqual(true);
                });
            } );
        } );
        
    } );
} );
