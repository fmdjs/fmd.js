/**
 * @fileoverview unit testing for fmd/combo
 * @author Edgar
 * @date 130419
 * */

describe( 'fmd/combo', function(){
    
    var getStyle = function( node, name ){
        var ret;
        
        if ( window.getComputedStyle ){
            ret = getComputedStyle( node );
        } else {
            ret = node.currentStyle;
        }
        
        return ret[name];
    };
    
    var fetchArgumentsLength,
    
    onFetch = function( group ){
        fetchArgumentsLength = group.length;
    };
    
    var originalHasStamp = fmd.config('hasStamp'),
        originalPlugin = fmd.config('plugin'),
        originalAsync = fmd.config('async'),
        originalCombo = fmd.config('combo');
    
    beforeEach(function(){
        fmd.config({
            hasStamp: true,
            plugin: true,
            async: true,
            combo: true
        });
    });
    
    afterEach(function(){
        fmd.config({
            hasStamp: originalHasStamp,
            plugin: originalPlugin,
            async: originalAsync,
            combo: originalCombo
        });
    });
    
    describe( '一度依赖', function(){
        
        beforeEach(function(){
            fmd.on( 'fetch', onFetch );
        });
        
        afterEach(function(){
            fmd.off('fetch',onFetch);
        });
        
        describe( '分组', function(){
            var el;
            
            beforeEach(function(){
                el = document.createElement('div');
                el.id = 'specs-combo-a';
                document.body.appendChild( el );
            });
            
            afterEach(function(){
                document.body.removeChild( el );
            });
            
            it( '每组只有一个文件，不进行combo', function(){
                var a, b, l;
                
                runs(function(){
                    define(['specs/combo/a','specs/combo/a.css'],function(A){
                        a = A;
                        b = getStyle( el, 'color' );
                        l = fetchArgumentsLength;
                    });
                });
                
                waitsFor(function(){
                    return !!a && !!b && !!l;
                });
                
                runs(function(){
                    expect(a).toEqual('a');
                    expect(b==='rgb(36, 4, 48)'||b==='#240430').toEqual(true);
                    expect(l).toEqual(2);
                });
            } );
        } );
        
        it( 'combo加载多个fmd模块', function(){
            var a, b, c, l;
            
            runs(function(){
                define(['specs/combo/b','specs/combo/b1','specs/combo/b2'], function( A, B, C ){
                    a = A;
                    b = B;
                    c = C;
                    l = fetchArgumentsLength;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('b');
                expect(b).toEqual('b1');
                expect(c).toEqual('b2');
                expect(l).toEqual(4);
            });
        } );
        
        it( 'combo加载多个non-fmd模块', function(){
            var a, b, c, l;
            
            runs(function(){
                define(['require'], function( require ){
                    require.use(['non!specs/combo/c','non!specs/combo/c1','non!specs/combo/c2'],function(){
                        a = specsComboC;
                        b = specsComboC1;
                        c = specsComboC2;
                        l = fetchArgumentsLength;
                    });
                });
            });
            
            waitsFor(function(){
                return !!c;
            });
            
            runs(function(){
                expect(a).toEqual(25643);
                expect(b).toEqual('volj5tg');
                expect(c).toEqual('xudifuio');
                expect(l).toEqual(4);
            });
        } );
        
        it( 'combo加载混合多个fmd&non-fmd模块', function(){
            var a, b, c, d, l;
            
            runs(function(){
                define(['specs/combo/d','non!specs/combo/d2','specs/combo/d1','non!specs/combo/d3'], function( A, B, C, D ){
                    a = A;
                    b = C;
                    c = specsComboD2;
                    d = specsComboD3;
                    l = fetchArgumentsLength;
                });
            });
            
            waitsFor(function(){
                return !!a && !!d && !!l;
            });
            
            runs(function(){
                expect(a).toEqual('d');
                expect(b).toEqual('d1');
                expect(c).toEqual('i8o8');
                expect(d).toEqual('456t7gyu');
                expect(l).toEqual(5);
            });
        } );
        
        it( '加载中的不再列入combo，已combo加载的不再加载', function(){
            var a,b,c,d,e;
            
            runs(function(){
                define(['non!specs/combo/i'],function(){
                    a = specsComboI;
                });
                define(['non!specs/combo/i','non!specs/combo/i1','non!specs/combo/i2'],function(){
                    b = specsComboI;
                    c = specsComboI1;
                    d = specsComboI2;
                });
                define(['non!specs/combo/i2'],function(A){
                    e = specsComboI2;
                });
            });
            
            waitsFor(function(){
                return !!a && !!c && !!e;
            });
            
            runs(function(){
                expect(a).toEqual(46);
                expect(b).toEqual(46);
                expect(c).toEqual(5602);
                expect(d).toEqual(4275);
                expect(e).toEqual(4275);
            });
        } );
        
        it( '存在关键模块时', function(){
            var a;
            
            runs(function(){
                define(['specs/combo/j','exports'], function(A,exports){
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
    
    describe( '多度依赖', function(){
        it( '间接依赖', function(){
            var a;
            
            define('specs/combo/m',['specs/combo/m1','specs/combo/n'],function(A,B){
                return A+'m'+B;
            });
            
            define('specs/combo/n',['specs/combo/n1'],function(A){
                return A+'n';
            });
            
            runs(function(){
                define(['specs/combo/m'],function(A){
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
        
        it( '一、二度依赖', function(){
            var a, b;
            //   > e2
            // e1 > e
            runs(function(){
                define(['specs/combo/e','specs/combo/e2'], function( A, B ){
                    a = A;
                    b = B;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('e1e');
                expect(b).toEqual('e2');
            });
        } );
        
        it( '多度依赖', function(){
            var a, b, c;
            // e > f1 > f
            // f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                define(['specs/combo/f','specs/combo/g','specs/combo/h'], function( A, B, C ){
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
    } );
    
    describe( '超过maxLength，拆分成多个combo文件', function(){
        
        beforeEach(function(){
            fmd.on('fetch',onFetch);
            fmd.config({
                comboMaxLength: 100
            });
        });
        
        afterEach(function(){
            fmd.off('fetch',onFetch);
            fmd.config({
                comboMaxLength: 1500
            });
        });
        
        it( '全fmd模块', function(){
            var a,b,c,d,e,l;
            
            runs(function(){
                define(['specs/combo/k','specs/combo/k1','specs/combo/k2','specs/combo/k3','specs/combo/k4'],function(A,B,C,D,E){
                    a = A;
                    b = B;
                    c = C;
                    d = D;
                    e = E;
                    l = fetchArgumentsLength;
                });
            });
            
            waitsFor(function(){
                return !!e;
            });
            
            runs(function(){
                expect(a).toEqual('k');
                expect(b).toEqual('k1');
                expect(c).toEqual('k2');
                expect(d).toEqual('k3');
                expect(e).toEqual('k4');
                expect(l).toEqual(7);
            });
        } );
        
        it( '混合non-fmd模块，且分文件后后一个文件只有一个non-fmd模块', function(){
            var a, b, c, d, l;
            
            runs(function(){
                define(['specs/combo/l','non!specs/combo/l1','non!specs/combo/l2','non!specs/combo/l3'],function(A,B,C,D){
                    a = A;
                    b = specsComboL1;
                    c = specsComboL2;
                    d = specsComboL3;
                    l = fetchArgumentsLength;
                });
            });
            
            waitsFor(function(){
                return !!d;
            });
            
            runs(function(){
                expect(a).toEqual('l');
                expect(b).toEqual('bo;reje');
                expect(c).toEqual('c8fio90;p;');
                expect(d).toEqual('c8fio90;p;ypwhtrwf34th');
                expect(l).toEqual(6);
            });
        } );
    });
} );
