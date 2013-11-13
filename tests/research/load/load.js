var doc = document,
    head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;

var load = function( url ){
    var node = doc.createElement('script');
    node.async = false;
    node.defer = false;
    node.src = url;
    head.appendChild( node );
};
