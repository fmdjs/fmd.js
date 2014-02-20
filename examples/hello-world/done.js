define(['require','output','w'], function( req, out, wo ){

    var he = req('h');//取得`h`模块的接口赋予给`he`变量

    out.page( he + ' ' + wo );//`page`方法由`output`模块提供
} );
