/**
 * @fileoverview unit testing for fmd/module
 * @author Edgar
 * @date 130129
 * */

describe( 'fmd语法', function(){
    
    describe( 'define关键字', function(){
        it( '存在关键字define', function(){
            expect(define).toBeTruthy();
        } );
        
        it( 'define是函数', function(){
            expect(typeof define).toEqual('function');
        } );
    } );
    
    
    describe( 'define语法', function(){
        it( 'define(id, factory)', function(){
            var a;
            
            define('specs/module/a', function(){
                return 'specs-module-a';
            });
            
            define(['specs/module/a'],function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-module-a');
        } );
        
        it( 'define(id, deps, factory)', function(){
            var a;
            
            define('specs/module/b1',function(){ return 'specs-module-a'; });
            
            define('specs/module/b', ['specs/module/b1'], function(A){
                return A.replace(/a/,'b');
            });
            
            define(['specs/module/b'], function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-module-b');
        } );
        
        it( 'define(deps, factory)', function(){
            var a;
            define('specs/module/c',function(){ return 'specs-module-a'; });
            define('specs/module/c1',function(){ return 'specs-module-b'; });
            
            define(['specs/module/c','specs/module/c1'], function( A, B ){
                a = A +'&'+ B;
            });
            
            expect(a).toEqual('specs-module-a&specs-module-b');
        } );
        
        it( 'define(factory)', function(){
            var a;
            
            define(function(){
                a = 'specs-module-d';
            });
            
            expect(a).toEqual('specs-module-d');
        } );
        
        it( 'define(id, factory<object>)', function(){
            var a;
            
            define('specs/module/e', {
                specs: 'specs',
                module: 'module',
                a: 'e'
            });
            
            define(['specs/module/e'], function(A){
                var temp = [];
                for ( var i in A ){
                    temp.push(A[i]);
                }
                a = temp.join('-');
            });
            
            expect(a).toEqual('specs-module-e');
        } );
        
        it( 'define(id, factory<array>)', function(){
            var a;
            
            define('specs/module/f', ['specs','module','f']);
            
            define(['specs/module/f'], function(A){
                a = A.join('-');
            });
            
            expect(a).toEqual('specs-module-f');
        } );
        
    } );
    
    
    describe( 'require关键字', function(){
        it( 'require', function(){
            var a;
            
            define('specs/module/g', function(){
                return 'specs-module-g';
            } );
            
            define(['require'], function(require){
                a = require('specs/module/g');
            });
            
            expect(a).toEqual('specs-module-g');
        } );
        
        it( 'require只读', function(){
            var a;
            
            define(['require'], function(require){
                require.temp = 'specs-module-h';
            });
            
            define(['require'], function(require){
                a = require.temp;
            });
            expect(a).toEqual(null);
        } );
    } );
    
    
    describe( 'exports关键字', function(){
        it( 'exports', function(){
            var a;
            
            define('specs/module/i', ['exports'], function(exports){
                exports.specs = 'specs';
                exports.module = 'module';
                exports.a = 'i';
            } );
            
            define(['require'], function(require){
                var A = require('specs/module/i');
                var temp = [];
                for ( var i in A ){
                    temp.push(A[i]);
                }
                a = temp.join('-');
            } );
            
            expect(a).toEqual('specs-module-i');
        } );
        
        it( 'exports不能被重写', function(){
            var a;
            
            define('specs/module/j', ['exports'], function(exports){
                exports = 'specs-module-j';
            } );
            
            define(['require'], function(require){
                a = require('specs/module/j');
            });
            
            expect(a).not.toBe('specs-module-j');
        } );
        
        it( 'return将覆盖exports', function(){
            var a;
            
            define('specs/module/k', ['exports'], function(exports){
                exports.temp = 'specs-module-k-temp';
                return { temp: 'specs-module-k' };
            } );
            
            define(['require'], function(require){
                var A = require('specs/module/k');
                a = A.temp;
            });
            
            expect(a).toEqual('specs-module-k');
        } );
    } );
    
    
    describe( 'module关键字', function(){
        it( 'module.id', function(){
            var a;
            
            define('specs/module/l', ['module'], function(module){
                return module.id;
            });
            
            define(['require'], function(require){
                var A = require('specs/module/l');
                a = A.replace(/\//g,'-');
            });
            
            expect(a).toEqual('specs-module-l');
        } );
        
        it( 'module.exports', function(){
            var a;
            
            define('specs/module/m', ['module'], function(module){
                module.exports = 'specs-module-m';
            });
            
            define(['require'], function(require){
                a = require('specs/module/m');
            });
            
            expect(a).toEqual('specs-module-m');
        } );
        
        it( 'module.exports与exports关键模块等同', function(){
            var a,b,c;
            
            define('specs/module/n',['exports','module'],function( exports, module ){
                exports.a = 'specs-module-n';
            });
            
            define(['specs/module/n'],function(A){
                a = A.a;
            });
            
            expect(a).toEqual('specs-module-n');
            
            define('specs/module/o',['exports','module'],function( exports, module ){
                exports.b = 'drcygui345y';
                module.exports.c = '67890pn4g';
            });
            
            define(['specs/module/o'],function(A){
                b = A.b;
                c = A.c;
            });
            
            expect(b).toEqual('drcygui345y');
            expect(c).toEqual('67890pn4g');
        } );
    } );

    describe( '@fmd内建模块', function(){
        it( '@fmd等于全局变量fmd', function(){
            var a;
            define(['@fmd'], function($fmd){
                a = $fmd === fmd;
            });

            expect(a).toEqual(true);
        } );
    } );
    
} );


fmd( 'specs/module', ['module'], function( module ){
    xdescribe( 'fmd/module', function(){
        it( 'Module.get', function(){} );
        it( 'Module.has', function(){} );
        it( 'Module.save', function(){} );
        it( 'Module.require', function(){} );
        it( 'Module.define', function(){} );
        it( 'mod.unnamed', function(){} );
        it( 'mod.compile', function(){} );
        it( 'mod.extract', function(){} );
        it( 'mod.autocompile', function(){} );
    } );
} );
