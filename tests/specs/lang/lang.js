/**
 * @fileoverview unit testing for fmd/lang
 * @author Edgar
 * @date 131009
 * */

fmd( 'specs/lang', ['lang'], function( lang ){
    describe( 'fmd/lang', function(){
        
        function A(){}
        A.prototype.aa = 1;
        
        var a = new A();
        a.bb = undefined;
        
        function b(){}
        var c = function(){};
        var d = new Function('');
        var e = /abc/;
        var f = new RegExp('abc');
        var g = [];
        var h = [1];
        var i = new Array(1);
        var j = { a: 1, b: 2 };
        var k = { a: function(){} };
        var l = new Object();
        var m = '';
        var n = '12';
        
        xit( 'lang.hasOwn', function(){
            expect(a.aa).toEqual(1);
            expect('bb' in a).toEqual(true);
            expect(lang.hasOwn(a,'aa')).toEqual(false);
            expect(lang.hasOwn(a,'bb')).toEqual(true);
        } );
        
        it( 'lang.isFunction', function(){
            expect(lang.isFunction(A)).toEqual(true);
            expect(lang.isFunction(a)).toEqual(false);
            expect(lang.isFunction(b)).toEqual(true);
            expect(lang.isFunction(c)).toEqual(true);
            expect(lang.isFunction(d)).toEqual(true);
            expect(lang.isFunction(e)).toEqual(false);
            expect(lang.isFunction(f)).toEqual(false);
            expect(lang.isFunction(j)).toEqual(false);
            expect(lang.isFunction(k)).toEqual(false);
        } );
        
        it( 'lang.isArray', function(){
            expect(lang.isArray(c)).toEqual(false);
            expect(lang.isArray(e)).toEqual(false);
            expect(lang.isArray(g)).toEqual(true);
            expect(lang.isArray(h)).toEqual(true);
            expect(lang.isArray(i)).toEqual(true);
            expect(lang.isArray(j)).toEqual(false);
        } );
        
        it( 'lang.isString', function(){
            expect(lang.isString(c)).toEqual(false);
            expect(lang.isString(e)).toEqual(false);
            expect(lang.isString(h)).toEqual(false);
            expect(lang.isString(j)).toEqual(false);
            expect(lang.isString(m)).toEqual(true);
            expect(lang.isString(n)).toEqual(true);
        } );
        
        it( 'lang.forEach', function(){
            var a = [1,2,3,4];
            lang.forEach( a, function( item, idx, arr ){
                arr[idx] = item*this;
            }, 3 );
            
            expect(a).toEqual([3,6,9,12]);
        } );
        
        it( 'lang.map', function(){
            var a = [1,2,3,4];
            var b = lang.map( a, function( item, idx, arr ){
                return item*idx*this*arr.length;
            }, 3 );
            
            var c = lang.map( [], function( item, idx, arr ){
                return idx;
            } );
            
            expect(a).toEqual([1,2,3,4]);
            expect(b).toEqual([0,24,72,144]);
            expect(c).toEqual([]);
        } );
        
        it( 'lang.inArray', function(){
            var a = [1,'2','a',4];
            
            expect(lang.inArray( a, 1 )).toEqual(0);
            expect(lang.inArray( a, 2 )).toEqual(-1);
            expect(lang.inArray( a, '2' )).toEqual(1);
            expect(lang.inArray( a, 'a' )).toEqual(2);
            expect(lang.inArray( a, 4 )).toEqual(3);
        } );
        
    } );
} );
