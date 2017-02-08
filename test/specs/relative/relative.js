/**
 * @fileoverview unit testing for fmd/relative
 * @author Edgar
 * @date 131119
 * */
 
fmd('specs/relative',['event','relative'],function( event, relative ){
    describe( 'fmd/relative', function(){
        it( 'relative.cwd', function(){
            expect(relative.cwd('a/b/c/d')).toEqual('a/b/c/');
            expect(relative.cwd('a/b/c')).toEqual('a/b/');
            expect(relative.cwd('a/bA/c-d')).toEqual('a/bA/');
            expect(relative.cwd('a/b-A/Ed')).toEqual('a/b-A/');
            expect(relative.cwd('a/A_A/Ed')).toEqual('a/A_A/');
            expect(relative.cwd('a/b')).toEqual('a/');
        } );
        
        it( 'relative.isDotStart', function(){
            expect(relative.isDotStart('.')).toEqual(true);
            expect(relative.isDotStart('a.')).toEqual(false);
            expect(relative.isDotStart('1.')).toEqual(false);
            expect(relative.isDotStart(' .')).toEqual(false);
            expect(relative.isDotStart('')).toEqual(false);
        } );
        
        it( 'relative.hasSlash', function(){
            expect(relative.hasSlash('a/')).toEqual(true);
            expect(relative.hasSlash('a/b')).toEqual(true);
            expect(relative.hasSlash('a/b/c')).toEqual(true);
            expect(relative.hasSlash('/a/')).toEqual(true);
            expect(relative.hasSlash('a')).toEqual(false);
            expect(relative.hasSlash('/a')).toEqual(false);
            expect(relative.hasSlash('/')).toEqual(false);
            expect(relative.hasSlash('')).toEqual(false);
        } );
        
        describe( 'relative.resolve', function(){
            it( './', function(){
                expect( relative.resolve( relative.cwd('a/b/c/d') , 'e' ) ).toEqual('a/b/c/e');
                expect( relative.resolve( relative.cwd('a/b/c/d') , './e' ) ).toEqual('a/b/c/e');
                expect( relative.resolve( relative.cwd('a/b/c') , './e' ) ).toEqual('a/b/e');
                expect( relative.resolve( relative.cwd('a/b') , './e' ) ).toEqual('a/e');
                expect( relative.resolve( relative.cwd('a/b/c-dfe/-eged') , './e' ) ).toEqual('a/b/c-dfe/e');
                expect( relative.resolve( relative.cwd('dgf/egedAefdf/ed-') , './e' ) ).toEqual('dgf/egedAefdf/e');
                expect( relative.resolve( relative.cwd('dgf/e_fdf/ed-') , './e' ) ).toEqual('dgf/e_fdf/e');
                expect( relative.resolve( relative.cwd('dgf/egefdf/ed') , './e' ) ).toEqual('dgf/egefdf/e');
                expect( relative.resolve( relative.cwd('dgf/eg4rdf/edAe') , './dweW' ) ).toEqual('dgf/eg4rdf/dweW');
            } );
            
            it( '../', function(){
                expect( relative.resolve( relative.cwd('a/b/c/d') , '../e' ) ).toEqual('a/b/e');
                expect( relative.resolve( relative.cwd('a/b/c') , '../e' ) ).toEqual('a/e');
                expect( relative.resolve( relative.cwd('a/c') , '../e' ) ).toEqual('e');
                expect( relative.resolve( relative.cwd('a/b/c-dfe/-eged') , '../e' ) ).toEqual('a/b/e');
                expect( relative.resolve( relative.cwd('dgf/egedAefdf/ed-') , '../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/e_fdf/.ed-') , '../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/egefdf/..ed') , '../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/eg4rdf/edAe') , '../dweW' ) ).toEqual('dgf/dweW');
            } );
            
            it( './../', function(){
                expect( relative.resolve( relative.cwd('a/b/c') , '../e' ) ).toEqual('a/e');
                expect( relative.resolve( relative.cwd('a/c') , '../e' ) ).toEqual('e');
                expect( relative.resolve( relative.cwd('a/b/c/d') , './../e' ) ).toEqual('a/b/e');
                expect( relative.resolve( relative.cwd('a/b/c-dfe/-eged') , './../e' ) ).toEqual('a/b/e');
                expect( relative.resolve( relative.cwd('dgf/egedAefdf/ed-') , './../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/e_fdf/.ed-') , './../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/egefdf/..ed') , './../e' ) ).toEqual('dgf/e');
                expect( relative.resolve( relative.cwd('dgf/eg4rdf/edAe') , './../dweW' ) ).toEqual('dgf/dweW');
            } );
            
            it( '../../', function(){
                expect( relative.resolve( relative.cwd('a/b/c/d') , '../../e' ) ).toEqual('a/e');
                expect( relative.resolve( relative.cwd('a/b/c-dfe/-eged') , '../../e' ) ).toEqual('a/e');
                expect( relative.resolve( relative.cwd('dgf/egedAefdf/ed-') , '../../e' ) ).toEqual('e');
                expect( relative.resolve( relative.cwd('dgf/e_fdf/.ed-') , '../../e' ) ).toEqual('e');
                expect( relative.resolve( relative.cwd('dgf/egefdf/..ed') , '../../e' ) ).toEqual('e');
                expect( relative.resolve( relative.cwd('dgf/eg4rdf/edAe') , '../../dweW' ) ).toEqual('dweW');
            } );
        } );
        
        it( 'event alias', function(){
            var a = {
                id: 'g3/d-d/aE'
            };
            var a1 = { id: '../gf' },
                a2 = { id: './ei' },
                a3 = { id: './../hgtr' },
                a4 = { id: '../../ki' },
                a5 = { id: 'erd/34543/ffe' },
                a6 = { id: '../asd' };
            
            event.emit('alias', a1, a );
            event.emit('alias', a2, a );
            event.emit('alias', a3, a );
            event.emit('alias', a4, a );
            event.emit('alias', a5, a );
            event.emit('alias', a6 );
            
            expect(a1.id).toEqual('g3/gf');
            expect(a2.id).toEqual('g3/d-d/ei');
            expect(a3.id).toEqual('g3/hgtr');
            expect(a4.id).toEqual('ki');
            expect(a5.id).toEqual('erd/34543/ffe');
            expect(a6.id).toEqual('../asd');
            
            var b = {
                id: ''
            };
            var b1 = { id: '../gf' },
                b2 = { id: './ei' },
                b3 = { id: './../hgtr' },
                b4 = { id: '../../ki' },
                b5 = { id: 'dfeAfe/ef0r-edw' };
            
            event.emit('alias', b1, b );
            event.emit('alias', b2, b );
            event.emit('alias', b3, b );
            event.emit('alias', b4, b );
            event.emit('alias', b5, b );
            
            expect(b1.id).toEqual('../gf');
            expect(b2.id).toEqual('./ei');
            expect(b3.id).toEqual('./../hgtr');
            expect(b4.id).toEqual('../../ki');
            expect(b5.id).toEqual('dfeAfe/ef0r-edw');
            
            var c = {
                id: 'nhtrf'
            };
            var c1 = { id: '../gf' },
                c2 = { id: './ei' },
                c3 = { id: './../hgtr' },
                c4 = { id: '../../ki' },
                c5 = { id: 'nr3e/3wg' };
            
            event.emit('alias', c1, c );
            event.emit('alias', c2, c );
            event.emit('alias', c3, c );
            event.emit('alias', c4, c );
            event.emit('alias', c5, c );

            expect(c1.id).toEqual('../gf');
            expect(c2.id).toEqual('./ei');
            expect(c3.id).toEqual('./../hgtr');
            expect(c4.id).toEqual('../../ki');
            expect(c5.id).toEqual('nr3e/3wg');
        } );
        
        it( 'deps support relative name', function(){
            var a;
            define('specs/relative/deps/a',function(){ return 'a'; });
            define('specs/relative/deps/b',function(){ return 'a12'; });
            define('specs/relative/c',function(){ return 'b'; });
            define('specs/relative/deps2/c',function(){ return '234b'; });
            
            define('specs/relative/deps/c',['./a','./b','../c','../deps2/c'],function(A,B,C,D){
                return A + B + C + D;
            });
            define(['specs/relative/deps/c'],function(c){
                a = c;
            });
            expect(a).toEqual('aa12b234b');
            
            var b;
            define('specs/relative/deps/d',['./e','../f'],function(E,F){ return E+F; });
            define('specs/relative/deps/e',function(){ return '2erge'; });
            define('specs/relative/f',function(){ return 'hu['; });
            define('specs/relative/deps/f',['./d'],function(D){ return D;});
            define(['specs/relative/deps/f'],function(F){
                b = F;
            });
            expect(b).toEqual('2ergehu[');
        } );
        
        it( 'require support relative name', function(){
            var a;
            define('specs/relative/req/a',function(){ return 'a'; });
            define('specs/relative/req/b',function(){ return 'a12'; });
            define('specs/relative/d',function(){ return 'd'; });
            define('specs/relative/req2/c',function(){ return '234b'; });
            
            define('specs/relative/req/c',['require'],function(require){
                return require('./a') + require('./b') + require('../d') + require('../deps2/c');
            });
            define(['specs/relative/req/c'],function(c){
                a = c;
            });
            expect(a).toEqual('aa12d234b');
        } );
    } );
});
