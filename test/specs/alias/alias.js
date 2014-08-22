/**
 * @fileoverview unit testing for fmd/alias
 * @author Edgar
 * @date 130927
 * */

fmd( 'specs/alias', ['event'], function( event ){
    describe( 'fmd/alias', function(){
        
        it( 'alias', function(){
            fmd.config({
                alias: {
                    'aliasa': 'ayj6yuyj',
                    'aliasb': 'yuj0ijedqr'
                }
            });
            
            var a = { id: 'aliasa' };
            var b = { id: 'aliasb' };
            var c = { id: 'aliasc' };
            
            event.emit( 'alias', a );
            event.emit( 'alias', b );
            event.emit( 'alias', c );
            
            expect(a.id).toEqual('ayj6yuyj');
            expect(b.id).toEqual('yuj0ijedqr');
            expect(c.id).toEqual('aliasc');
        } );
        
        it( 'deps & require别名', function(){
            fmd.config({
                alias: {
                    'aliasd': 'specs/alias/d',
                    'aliase': 'specs/alias/e'
                }
            });
            
            var a, b;
            
            define( 'specs/alias/d', function(){ return '23rtgf'; } );
            define( 'specs/alias/e', function(){ return 'fo9p0p;lm'; } );
            define(['aliasd','require'],function(A,require){
                a = A;
                b = require('aliase');
            });
            
            expect(a).toEqual('23rtgf');
            expect(b).toEqual('fo9p0p;lm');
        } );
    } );
} );
