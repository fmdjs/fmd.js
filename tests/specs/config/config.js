/**
 * @fileoverview unit testing for fmd/config
 * @author Edgar
 * @date 131015
 * */

fmd( 'specs/config', ['config'], function( config ){
    describe( 'fmd/config', function(){
        
        var configCache = fmd.cache.config,
            configRules = fmd.cache.configRules;
        
        it( 'config.register rule', function(){
            var ruleA = function( current, key, val ){
                this['debug1'] = val === 'debug' ? true : false;
                this[key] = val;
            };
            
            config.register({
                name: 'ruleA',
                rule: ruleA
            });
            
            expect(configRules.ruleA.rule.toString()).toEqual(ruleA.toString());
        } );
        
        it( 'config.register keys', function(){
            config.register({
                name:'ruleB',
                rule: function( current, key, val ){
                    this['debug2'] = val === 'debug' ? true : false;
                    this[key] = val;
                }
            });
            config.register( { keys:'logLevel1', name: 'ruleB' } );
            var a = configRules.ruleB.keys.slice();
            config.register( {keys:'log1', name:'ruleB'} );
            var b = configRules.ruleB.keys.slice();
            
            var c = configCache.debug2;
            config.set({
                'logLevel1': 'log'
            });
            var d = configCache.debug2;
            var e = configCache.logLevel1;
            var f = configCache.log1;
            config.set({
                'log1': 'debug'
            });
            var g = configCache.debug2;
            var h = configCache.log1;
            var i = configCache.logLevel1;
            
            expect(a).toEqual(['logLevel1']);
            expect(b).toEqual(['logLevel1','log1']);
            expect(c).toEqual(undefined);
            expect(d).toEqual(false);
            expect(e).toEqual('log');
            expect(f).toEqual(undefined);
            expect(g).toEqual(true);
            expect(h).toEqual('debug');
            expect(i).toEqual('log');
        } );
        
        it( 'config.register', function(){
            var exist = [];
            for ( var name in configRules ){
                exist.push( name );
            }
            exist = exist.join(',');
            
            config.register({
                keys: 'xxx',
                rule: function( current, key, val ){
                    this[key] = current > 0 ? ( current + val ) : val;
                }
            });
            
            var newRule;
            for ( var name in configRules ){
                if ( exist.indexOf( name ) < 0 ){
                    newRule = name;
                    break;
                }
            }

            expect(newRule).toBeDefined();
            expect(configRules[newRule].keys[0]).toEqual('xxx');
            expect(configCache.xxx).toEqual(undefined);
            
            config.set({
                'xxx': 3
            });
            expect(configCache.xxx).toEqual(3);
            
            config.set({
                'xxx': 4
            });
            expect(configCache.xxx).toEqual(7);
            
            
            config.register({
                keys: ['xxx1','xxx2'],
                name: 'xx11',
                rule: function( current, key, val ){
                    this['debug3'] = typeof val === 'string' ? true : false;
                    this[key] = val;
                }
            });
            
            expect(configCache.debug3).not.toBeDefined();
            expect(configCache.xxx1).not.toBeDefined();
            expect(configCache.xxx2).not.toBeDefined();
            
            config.set({
                'xxx1': 24353
            });
            
            expect(configCache.xxx1).toEqual(24353);
            expect(configCache.debug3).toEqual(false);
            
            config.set({
                'xxx2': 'etdfh30'
            });
            
            expect(configCache.xxx2).toEqual('etdfh30');
            expect(configCache.debug3).toEqual(true);
            
            config.register({ keys: 'xxx3', name: 'xx11' });
            config.set({ 'xxx3': 'et8h38r3' });
            
            expect(configCache.xxx3).toEqual('et8h38r3');
            expect(configCache.debug3).toEqual(true);
        } );
        
        it( 'config rule "object"', function(){
            config.register( {keys:'alias1', name:'object'} );
            config.set({
                alias1: {
                    'aa': '123456aa',
                    'bb': '123445bb'
                }
            });
            
            config.register( {keys:'alias2', name:'object'} );
            config.set({
                alias2: {
                    'aa': 'dfghjk',
                    'bb': '5yujkth',
                    'cc': 'floyp9fe'
                }
            });
            config.set({
                alias2: {
                    'cc': '57fgyio'
                }
            });
            
            expect(configCache.alias1.aa).toEqual('123456aa');
            expect(configCache.alias1.bb).toEqual('123445bb');
            expect(configCache.alias2.aa).toEqual('dfghjk');
            expect(configCache.alias2.bb).toEqual('5yujkth');
            expect(configCache.alias2.cc).toEqual('57fgyio');
        } );
        
        it( 'config rule "array"', function(){
            config.register( {keys:'resolve1', name:'array'} );
            var a = configCache.resolve1;
            config.set({
                resolve1: '1thj6y'
            });
            var b = configCache.resolve1.slice();
            config.set({
                resolve1: '5tyhgyu'
            });
            var c = configCache.resolve1.slice();
            
            expect(a).toEqual(undefined);
            expect(b).toEqual(['1thj6y']);
            expect(c).toEqual(['1thj6y','5tyhgyu']);
        } );
        
        it( 'config.set & config.get', function(){
            config.set({
                resolve2: 'thj3'
            });
            
            expect(config.get('resolve2')).toEqual(configCache.resolve2);
        } );
        
        it( 'fmd.config', function(){
            fmd.config({
                resolve3: 'g;pj'
            });
            
            expect(fmd.config('resolve3')).toEqual(configCache.resolve3);
        } );
        
    } );
} );
