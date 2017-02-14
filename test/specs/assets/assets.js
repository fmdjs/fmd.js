/**
 * @fileoverview unit testing for fmd/config
 * @author Edgar
 * @date 131015
 * */

fmd( 'specs/assets', ['assets','event'], function( assets, event ){
    describe( 'fmd/assets', function(){
        
        var assetsCache = fmd.cache.assets;
        
        it( 'assets.make', function(){
            var a = assets.make('specs/assets/a');
            var b = assets.make('specs/assets/a');
            expect(a).toEqual(b);
            expect(a.url.indexOf('a.js') > 1 ).toEqual(true);
            
            a.isTest = 'true';
            expect(b.isTest).toEqual('true');
            
            var c = assets.make('specs/assets/a');
            expect(c.isTest).toEqual('true');
            
            var d = assets.make('require');
            expect(d.url).toEqual(d.id);
        } );
        
        it( 'assets.group', function(){
            var a = { deps: ['specs/assets/b','specs/assets/c','exports'] };
            var group = assets.group( a );
            expect(group.length).toEqual(3);
            expect(group[0]).toEqual(assets.make(a.deps[0]));
            expect(group[1]).toEqual(assets.make(a.deps[1]));
            expect(group[2]).toEqual(assets.make(a.deps[2]));
        } );
    } );
} );
