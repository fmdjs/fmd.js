/**
 * @fileoverview unit testing for fmd/event
 * @author Edgar
 * @date 130423
 * */

fmd( 'specs/event', ['event'], function( event ){
    describe( 'fmd/event', function(){
        
        var eventsCache = fmd.cache.events;
        
        var flowA = function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
        };
        var flowB = function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
        };
        var flowC=  function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
            meta.c = meta.c ? ++meta.c : 1;
        };
        var flowD = function( meta, val ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
            meta.c = meta.c ? ++meta.c : val;
        };
        
        
        it( 'event.on', function(){
            var a = eventsCache.a;
            
            event.on( 'a', function( meta ){
                meta.a = meta.a ? ++meta.a : 1;
            } );
            var b = eventsCache.a.slice();
            
            event.on( 'a', flowB );
            var c = eventsCache.a.slice();
            
            event.on( 'b', flowC );
            var d = eventsCache.b.slice();
            
            expect(a).toEqual(undefined);
            expect(b.length).toEqual(1);
            expect(c.length).toEqual(2);
            expect(d.length).toEqual(1);
        } );
        
        it( 'event.emit', function(){
            event.on( 'c', flowA );
            event.on( 'c', flowB );
            event.on( 'd', flowC );
            
            var meta = {};
            event.emit( 'c', meta );
            var a = meta.a;
            var b = meta.b;
            
            event.emit( 'c', meta );
            var c = meta.a;
            var d = meta.b;
            
            event.on( 'c', flowD );
            event.emit( 'c', meta, 5 );
            var e = meta.a;
            var f = meta.b;
            var g = meta.c;
            
            event.emit( 'd', meta );
            var h = meta.a;
            var i = meta.b;
            var j = meta.c;
            
            expect(a).toEqual(2);
            expect(b).toEqual(1);
            expect(c).toEqual(4);
            expect(d).toEqual(2);
            expect(e).toEqual(7);
            expect(f).toEqual(4);
            expect(g).toEqual(5);
            expect(h).toEqual(8);
            expect(i).toEqual(5);
            expect(j).toEqual(6);
        } );
        
        it( 'event.off', function(){
            event.on( 'e', flowA );
            event.on( 'e', flowB );
            event.on( 'e', flowD );
            
            var meta = {};
            event.emit( 'e', meta, 5 );
            var a = meta.a;
            var b = meta.b;
            var c = meta.c;
            
            event.off('e');
            event.emit( 'e', meta, 5 );
            
            expect(eventsCache.e).toEqual(undefined);
            expect(a).toEqual(3);
            expect(a).toEqual(meta.a);
            expect(b).toEqual(2);
            expect(b).toEqual(meta.b);
            expect(c).toEqual(5);
            expect(c).toEqual(meta.c);
            
            var atom = {};
            event.on( 'f', flowA );
            event.emit( 'f', atom );
            expect(atom.a).toEqual(1);
            
            event.emit( 'f', atom );
            expect(atom.a).toEqual(2);
            
            event.off( 'f', flowA );
            event.emit( 'f', atom );
            expect(atom.a).toEqual(2);
            expect(eventsCache.f.length).toEqual(0);
        } );
        
        it( 'fmd.on, fmd.off', function(){
            expect(fmd.on).toEqual(event.on);
            expect(fmd.off).toEqual(event.off);
            
            var atom = {};
            event.on( 'g', flowA );
            event.emit( 'g', atom );
            expect(atom.a).toEqual(1);
            
            event.emit( 'g', atom );
            expect(atom.a).toEqual(2);
            
            event.off( 'g', flowA );
            event.emit( 'g', atom );
            expect(atom.a).toEqual(2);
            expect(eventsCache.g.length).toEqual(0);
        } );
        
    } );
} );
