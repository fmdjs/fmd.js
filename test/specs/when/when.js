/**
 * @fileoverview unit testing for fmd/when
 * @author Edgar
 * @date 130419
 * */

fmd( 'specs/when', ['when'], function( when ){
    describe( 'fmd/when', function(){
        
        it( 'when resolve', function(){
            var a = [];
            
            var b = function( promise ){
                setTimeout(function(){
                    a.push(4);
                    promise.resolve();
                }, 400 );
            },
            c = function( promise ){
                setTimeout(function(){
                    a.push(5);
                    promise.resolve();
                }, 200 );
            };
            
            runs(function(){
                when( b, c ).then( function(){
                    a.push(6);
                }, function(){
                    a.push(7);
                } );
            });
            
            waitsFor(function(){
                return a.length === 3;
            });
            
            runs(function(){
                expect(a[a.length-1]).toEqual(6);
                expect(a.sort()).toEqual([4,5,6]);
            });
            
        } );
        
        it( 'when reject', function(){
            var a = [];
            
            var b = function( promise ){
                setTimeout(function(){
                    a.push(4);
                    promise.resolve();
                }, 600 );
            },
            c = function( promise ){
                setTimeout(function(){
                    a.push(5);
                    promise.resolve();
                }, 200 );
            },
            d = function( promise ){
                setTimeout(function(){
                    a.push(8);
                    promise.reject();
                }, 400 );
            };
            
            runs(function(){
                when( b, c, d ).then( function(){
                    a.push(6);
                }, function(){
                    a.push(7);
                } );
            });
            
            waitsFor(function(){
                return a.length === 4;
            });
            
            runs(function(){
                expect(a.sort()).toEqual([4,5,7,8]);
            });
            
        } );
        
        it( 'when不延时', function(){
            var a = [];
            
            var b = function( promise ){
                a.push(4);
                promise.resolve();
            },
            c = function( promise ){
                a.push(5);
                promise.resolve();
            };
            
            runs(function(){
                when( b, c ).then( function(){
                    a.push(6);
                }, function(){
                    a.push(7);
                } );
            });
            
            waitsFor(function(){
                return a.length === 3;
            });
            
            runs(function(){
                expect(a[a.length-1]).toEqual(6);
                expect(a.sort()).toEqual([4,5,6]);
            });
            
        } );
        
        it( 'when部分延时部分不延时', function(){
            var a = [];
            
            var b = function( promise ){
                a.push(4);
                promise.resolve();
            },
            c = function( promise ){
                setTimeout(function(){
                    a.push(5);
                    promise.resolve();
                }, 300 );
            };
            
            runs(function(){
                when( b, c ).then( function(){
                    a.push(6);
                }, function(){
                    a.push(7);
                } );
            });
            
            waitsFor(function(){
                return a.length === 3;
            });
            
            runs(function(){
                expect(a[a.length-1]).toEqual(6);
                expect(a.sort()).toEqual([4,5,6]);
            });
            
        } );
        
        it( '没有when条件，默认resolve', function(){
            var a;
            
            when.apply( null, [] ).then( function(){
                a = 1;
            } );
            
            expect(a).toEqual(1);
            
        } );
        
    } );
} );
