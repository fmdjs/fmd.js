/**
 * @module sandbox for fmd.js in node
 * @author Edgar
 * @date 131118
 * */
 
exports.console = console;

exports.setTimeout = setTimeout;
exports.clearTimeout = clearTimeout;

exports.navigator = {
    userAgent: ''
};

exports.document = {
    head: {},
    
    getElementsByTagName: function( tag ){
        
        if ( tag === 'script' ){
            return [{
                hasAttribute: true,
                src: 'http://fmdjs.org/'
            }];
        }
        
        return [];
    },
    
    createElement: function( tag ){
        
        if ( tag === 'script' ){
            return {
                async: true
            };
        }
        
        return {};
    }
};
