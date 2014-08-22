var fmd = require('../../../lib/fmd.js');

define('a',function(){
    return {
        xxx: '4567'
    };
});

define(['a','../b'],function(a,b){
    console.log(a.xxx);
    console.dir( global.fmd === fmd );
});
