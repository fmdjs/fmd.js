/**
 * @fileoverview unit testing for fmd/non
 * @author Edgar
 * @date 131017
 * */
fmd( 'specs/non', ['plugin','assets'], function(plugin,assets){
    describe( 'fmd/non', function(){
        
        var pluginCache = fmd.cache.plugin,
            originPlugin = fmd.config('plugin');
        
        beforeEach(function(){
            fmd.config({
                plugin: true
            });
        });
        
        afterEach(function(){
            fmd.config({
                plugin: originPlugin
            });
        });
        
        it( 'plugin non', function(){
            expect(typeof pluginCache.non).toEqual('function');
            expect(pluginCache.non.length).toEqual(1);
        } );
        
        it( 'non execute', function(){
            var ids = ['non!specs/non/c','non!specs/non/c1','non!specs/non/c2'],
                task = plugin.sorting( assets.group( ids ) )[0];
            
            var a,b,c,d,e;
            runs(function(){
                task.execute(function(){
                    define(ids, function(A,B,C){
                        a = A;
                        b = B;
                        c = C;
                        d = specsNonC;
                        e = specsNonC1;
                    });
                });
            });
            
            waitsFor(function(){
                return !!d && !!e;
            });
            
            runs(function(){
                expect(a).toEqual(null);
                expect(b).toEqual(null);
                expect(c).toEqual(null);
                expect(d).toEqual(3);
                expect(e).toEqual(8);
            });
        } );
    } );
} );

describe( 'deps non支持', function(){
    
    var originAsync = fmd.config('async'),
        originPlugin = fmd.config('plugin');
    
    beforeEach(function(){
        fmd.config({
            async: true,
            plugin: true
        });
    });
    
    afterEach(function(){
        fmd.config({
            async: originAsync,
            plugin: originPlugin
        });
    });
    
    it( 'non-fmd文件，并行加载，顺序执行', function(){
        var a, a1, a2;
        
        runs(function(){
            define(['non!specs/non/a','non!specs/non/a1','non!specs/non/a2'],function(){
                a = window.specsNonA;
                a1 = window.specsNonA1;
                a2 = window.specsNonA2;
            });
        });
        
        waitsFor(function(){
            return !!a2;
        });
        
        runs(function(){
            expect(a.a1).toEqual('specs-non-a1');
            expect(a.a2).toEqual('specs-non-a2');
            expect(a1).toEqual(27);
            expect(a2).toEqual(99);
        });
    } );
    
    it( 'non-fmd文件，重复并行加载', function(){
        var a, b, c, d, e, f, g;
        
        runs(function(){
            define(['non!specs/non/b','non!specs/non/b1'],function(){
                a = window.specsNonB.b;
                b = window.specsNonB.b1;
                c = window.specsNonB1;
            });
            
            define(['non!specs/non/b','non!specs/non/b1','non!specs/non/b2'],function(){
                d = window.specsNonB.b;
                e = window.specsNonB1;
                f = window.specsNonB.b2;
                g = window.specsNonB2;
            });
        });
        
        waitsFor(function(){
            return !!c && !!g;
        });
        
        runs(function(){
            expect(a).toEqual(976);
            expect(b).toEqual('specs-non-b1');
            expect(c).toEqual(1000);
            expect(d).toEqual(976);
            expect(e).toEqual(1000);
            expect(f).toEqual('specs-non-b2');
            expect(g).toEqual(1275);
        });
    } );
    
    it( 'fmd、non-fmd模块共存，并二度依赖', function(){
        
        var a,b,c,d,e;
        
        runs(function(){
            define(['specs/non/f','non!specs/non/g','non!specs/non/g1','specs/non/h'],function(A,B,C,D){
                a = A;
                b = D;
                c = specsNonF1;
                d = specsNonG;
                e = specsNonG1;
            });
        });
        
        waitsFor(function(){
            return !!d;
        });
        
        runs(function(){
            expect(a).toEqual(152);
            expect(c).toEqual(67);
            expect(b).toEqual('efferriuin');
            expect(d.a).toEqual('efferr');
            expect(d.b).toEqual(3944);
            expect(d.c).toEqual(43804);
            expect(e).toEqual('67fgui');
        });
    } );
} );

describe( 'require.use non支持', function(){
    
    var originPlugin = fmd.config('plugin');
    
    beforeEach(function(){
        fmd.config({
            plugin: true
        });
    });
    
    afterEach(function(){
        fmd.config({
            plugin: originPlugin
        });
    });
    
    it( 'non-fmd文件，并行加载，顺序执行', function(){
        var a, a1, a2;
        
        runs(function(){
            define(['require'],function(require){
                require.use(['non!specs/non/d','non!specs/non/d1','non!specs/non/d2'],function(){
                    a = window.specsNonD;
                    a1 = window.specsNonD1;
                    a2 = window.specsNonD2;
                });
            });
        });
        
        waitsFor(function(){
            return !!a2;
        });
        
        runs(function(){
            expect(a.a1).toEqual('specs-non-d1');
            expect(a.a2).toEqual('specs-non-d2');
            expect(a1).toEqual(27);
            expect(a2).toEqual(99);
        });
    } );
    
    it( 'non-fmd文件，重复并行加载', function(){
        var a, b, c, d, e, f, g;
        
        runs(function(){
            define(['require'],function(require){
                require.use(['non!specs/non/e','non!specs/non/e1'],function(){
                    a = window.specsNonE.b;
                    b = window.specsNonE.b1;
                    c = window.specsNonE1;
                });
            });
            
            define(['require'],function(require){
                require.use(['non!specs/non/e','non!specs/non/e1','non!specs/non/e2'],function(){
                    d = window.specsNonE.b;
                    e = window.specsNonE1;
                    f = window.specsNonE.b2;
                    g = window.specsNonE2;
                });
            });
        });
        
        waitsFor(function(){
            return !!c && !!g;
        });
        
        runs(function(){
            expect(a).toEqual(976);
            expect(b).toEqual('specs-non-e1');
            expect(c).toEqual(1000);
            expect(d).toEqual(976);
            expect(e).toEqual(1000);
            expect(f).toEqual('specs-non-e2');
            expect(g).toEqual(1275);
        });
    } );
} );
