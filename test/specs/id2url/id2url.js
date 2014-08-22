/**
 * @fileoverview unit testing for fmd/id2url
 * @author Edgar
 * @date 131015
 * */

fmd( 'specs/id2url', ['event','config'], function( event, config ){
    describe( 'fmd/id2url', function(){
        
        var id2url = function( asset ){
            event.emit( 'id2url', asset );
        };
        var alias = function( asset ){
            event.emit( 'alias', asset );
        };
        
        var baseUrl = config.get('baseUrl');
        
        fmd.config({
            hasStamp: false
        });
        
        it( 'id2url', function(){
            var a = { id: 'erd4e' };
            var b = { id: 'wegf.css' };
            
            id2url(a);
            id2url(b);
            
            expect(a.url).toEqual(baseUrl+'erd4e.js');
            expect(b.url).toEqual(baseUrl+'wegf.css');
        } );
        
        it( 'id2url存在alias', function(){
            var a = { id: 'dj' };
            var b = { id: 'uj' };
            fmd.config({
                alias: {
                    'dj': 'gbnjoe',
                    'uj': 'hd0efjj'
                }
            });
            
            alias(a);
            id2url(a);
            alias(b);
            id2url(b);
            
            expect(a.url).toEqual(baseUrl+'gbnjoe.js');
            expect(b.url).toEqual(baseUrl+'hd0efjj.js');
        } );
        
        it( 'id2url存在resolve', function(){
            var a = { id: 'ed/ge'};
            var b = { id: 'ws/ged' };
            fmd.config({
                resolve: function( id ){
                    var parts = id.split('/'),
                        root = parts[0];
                    switch(root){
                        case 'ed':
                            id = 'sw/'+id;
                            break;
                        case 'ws':
                            id = 'wsfd/'+parts.slice(1).join('/');
                            break;
                    }
                    return id;
                }
            });
            
            id2url(a);
            id2url(b);
            
            expect(a.url).toEqual(baseUrl+'sw/ed/ge.js');
            expect(b.url).toEqual(baseUrl+'wsfd/ged.js');
        });
        
        it( 'id2url存在多个resolve', function(){
            var a = { id: 'eed/ge'};
            var b = { id: 'wss/ged' };
            fmd.config({
                resolve: function( id ){
                    var parts = id.split('/'),
                        root = parts[0];
                    switch(root){
                        case 'eed':
                            id = 'sww/'+id;
                            break;
                        case 'wss':
                            id = 'wsffd/'+parts.slice(1).join('/');
                            break;
                    }
                    return id;
                }
            });
            
            id2url(a);
            id2url(b);
            
            expect(a.url).toEqual(baseUrl+'sww/eed/ge.js');
            expect(b.url).toEqual(baseUrl+'wsffd/ged.js');
        } );
        
        it( 'id2url存在stamp', function(){
            var a = { id: 'yhm/ghi' };
            var b = { id: 'ij/bjop' };
            fmd.config({
                stamp: {
                    '^yhm': '130324',
                    '.*bjop': '0.122'
                }
            });
            
            id2url(a);
            id2url(b);
            
            var c = { id: 'dfg/po' };
            fmd.config({
                hasStamp: true
            });
            
            id2url(c);
            
            expect(a.url).toEqual(baseUrl+'yhm/ghi.js?fmd.stamp=130324');
            expect(b.url).toEqual(baseUrl+'ij/bjop.js?fmd.stamp=0.122');
            expect(c.url.split('=')[0]).toEqual(baseUrl+'dfg/po.js?fmd.stamp');
        } );
        
    } );
} );
