/**
 * @fileoverview unit testing for fmd/config
 * @author Edgar
 * @date 131015
 * */

fmd( 'specs/plugin', ['event','assets','plugin'], function( event, assets, plugin ){
    describe( 'fmd/plugin', function(){
        
        var pluginCache = fmd.cache.plugin;
        
        it( 'plugin.defaultPlugin', function(){
            expect(plugin.defaultPlugin).toEqual('async');
        } );
        
        it( 'plugin.register', function(){
            var a = function(){};
            plugin.register( 'dw3e2', a );
            expect(pluginCache.dw3e2).toEqual(a);
            
            var b = function(){};
            plugin.register( 'dw3e2', b );
            expect(pluginCache.dw3e2).not.toEqual(a);
            expect(pluginCache.dw3e2).toEqual(b);
        } );
        
        it( 'plugin.sorting', function(){
            var a = [{
                id: 'df3f302',
                plugin: 'plugin'
            }, {
                id: 'nldkfpu93',
                plugin: 'plugin'
            }];
            var tasks1 = plugin.sorting(a);
            expect(tasks1.length).toEqual(1);
            expect(tasks1[0].group.length).toEqual(a.length);
            
            var b = function(){};
            plugin.register( 'yiuh8', b );
            var c = [{
                id: 'df3f302',
                plugin: 'plugin'
            }, {
                id: 'df33r302',
                plugin: 'yiuh8'
            }, {
                id: 'drtger3f302',
                plugin: 'plugin'
            }, {
                id: 'df3f3023ed',
                plugin: 'yiuh8'
            }, {
                id: 'df023ed',
                plugin: 'yiuh8'
            }, {
                id: 'df3f3023ed',
                plugin: 'rf3uh8'
            }];
            var tasks2 = plugin.sorting(c);
            expect(tasks2.length).toEqual(3);
            expect(tasks2[1].group.length).toEqual(3);
            expect(tasks2[1].execute).toEqual(b);
            expect(tasks2[2].execute).not.toBeDefined();
        } );
    } );
    
    describe( 'event: analyze', function(){
        
        var pluginCache = fmd.cache.plugin;
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
        
        it( 'plugin analyze', function(){
            var a = { id: 'aadfefe33' };
            event.emit( 'analyze', a );
            expect(a.id).toEqual('aadfefe33');
            expect(a.plugin).toEqual(plugin.defaultPlugin);
            
            var b = { id: '!dde33ddw' };
            event.emit( 'analyze', b );
            expect(b.id).toEqual('!dde33ddw');
            expect(b.plugin).toEqual(plugin.defaultPlugin);
            
            pluginCache.etefwe = function(){};
            var c = { id: 'etefwe!g3ff3fdl' };
            event.emit( 'analyze', c );
            expect(c.id).toEqual('g3ff3fdl');
            expect(c.plugin).toEqual('etefwe');
        } );
        
        it( 'assets.make support analyze', function(){
            var meta = { id: 'dfef3!dfd9r3h' };
            var e = assets.make( meta.id );
            event.emit( 'analyze', meta );
            expect(meta.id).toEqual(e.id);
            expect(meta.plugin).toEqual(e.plugin);
            event.emit( 'id2url', meta );
            expect(meta.url).toEqual(e.url);
        } );
        
        it( 'assets.group support analyze', function(){
            var ids = ['ytr!specs/plugin/b','hgrf!specs/plugin/c','exports'];
            var group = assets.group( ids );
            expect(group.length).toEqual(ids.length);
            expect(group[0]).toEqual(assets.make(ids[0]));
            expect(group[1]).toEqual(assets.make(ids[1]));
            expect(group[2]).toEqual(assets.make(ids[2]));
        } );
    } );
    
    describe( 'plugin async', function(){
        
        var pluginCache = fmd.cache.plugin;
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
        
        it( 'plugin async', function(){
            expect(typeof pluginCache.async).toEqual('function');
            expect(pluginCache.async.length).toEqual(1);
        } );
        
        it( 'plugin async execute', function(){
            var ids = ['specs/plugin/a','specs/plugin/b','specs/plugin/c'],
                task = plugin.sorting( assets.group( ids ) )[0];
            
            var a,b,c;
            runs(function(){
                task.execute(function(){
                    define(ids, function(A,B,C){
                        a = A;
                        b = B;
                        c = C;
                    });
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
        
        it( 'async existed', function(){
            define('specs/plugin/d',function(){ return 'd';});
            define('specs/plugin/e',function(){ return 'e';});
            
            var ids = ['specs/plugin/d','specs/plugin/e','specs/plugin/f','specs/plugin/g'],
                task = plugin.sorting( assets.group(ids) )[0];
            
            var d,e,f,g;
            runs(function(){
                task.execute(function(){
                    define( ids, function(D,E,F,G){
                        d = D;
                        e = E;
                        f = F;
                        g = G;
                    } );
                });
            });
            
            waitsFor(function(){
                return !!g;
            });
            
            runs(function(){
                expect(d).toEqual('d');
                expect(e).toEqual('e');
                expect(f).toEqual('f');
                expect(g).toEqual('g');
            });
        } );
    } );
} );
