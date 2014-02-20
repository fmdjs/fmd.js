define( 'output', ['exports'], function( exp ){

    exp.page = function( message ){//对外提供`page`方法
        document.write( message );
        console && console.log( message );
    };
} );
