/**
 * @fileoverview unit testing for fmd/logger
 * @author Edgar
 * @date 131007
 * */

describe( 'fmd/logger', function(){
    
    var originDebug = fmd.config('debug');
    
    var noop = function(){};
    
    describe( 'debug: true', function(){
        beforeEach(function(){
            fmd.config({
                debug: true
            });
        });
        
        afterEach(function(){
            fmd.config({
                debug: originDebug
            });
        });
        
        it( 'debug: true', function(){
            
            fmd.log('log中的fmd.log打印的info日志','info');
            fmd.log('log中的fmd.log打印的warn日志','warn');
            
            expect(fmd.log.length).toEqual(2);
            expect(fmd.config('debug')).toEqual(true);
        } );
        
    } );
    
    describe( 'debug: false', function(){
        beforeEach(function(){
            fmd.config({
                debug: false
            });
        });
        
        afterEach(function(){
            fmd.config({
                debug: originDebug
            });
        });
        
        it( 'debug: false', function(){
            
            fmd.log('这行log中的fmd.log打印不出来','info');
            fmd.log('这行log中的fmd.log也打印不出来','warn');
            
            expect(fmd.log.length).toEqual(0);
            expect(fmd.config('debug')).toEqual(false);
        } );
    } );
    
} );
