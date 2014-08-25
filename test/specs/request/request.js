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
                            a = getStyle( el, 'color').toLowerCase();
                        },200);
                    } );
                });
                
                waitsFor(function(){
                    return !!a;
                });
                
                runs(function(){
                    expect( a === 'rgb(144, 40, 71)' || a === '#902847' ).toEqual(true);
                });
            } );
        } );
        
        describe( 'request css multiple', function(){
            var b, c;
                
            beforeEach(function(){
                b = document.createElement('div');
                c = document.createElement('div');
                b.id = 'specs-request-b';
                c.id = 'specs-request-c';
                document.body.appendChild( b );
                document.body.appendChild( c );
            });
            
            afterEach(function(){
                document.body.removeChild( b );
                document.body.removeChild( c );
            });
            
            it( 'request css multiple', function(){
                var a, d;
                
                runs(function(){
                    request( {url:'/test/specs/request/b.css?'+t}, function(){
                        setTimeout(function(){
                            a = getStyle( b, 'color' ).toLowerCase();
                        },200);
                    } );
                    request( {url:'/test/specs/request/c.css?'+t}, function(){
                        setTimeout(function(){
                            d = getStyle( c, 'color' ).toLowerCase();
                        },200);
                    } );
                });
                
                waitsFor(function(){
                    return !!a && !!d;
                });
                
                runs(function(){
                    expect( a === 'rgb(88, 36, 56)' || a === '#582438' ).toEqual(true);
                    expect( d === 'rgb(160, 48, 104)' || d === '#a03068' ).toEqual(true);
                });
            } );
        } );
        
    } );
} );
