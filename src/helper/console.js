/**
 * @module fmd/console
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 130324
 * */


fmd( 'console', ['global','lang'],
    function( global, lang ){
    'use strict';
    
    /**
     * Thanks to:
     * http://jquery.glyphix.com/jquery.debug/jquery.debug.js
     * */
    
    var doc = global.document;
    
    var messageList = [],
        messageBox = null,
        prepared = false;
    
    var createMessage = function( item ){
        
        var li = doc.createElement('li');
        li.style.color = 'warn' === item.type ? 'red' : '#000';
        li.innerHTML = item.message;
        messageBox.appendChild( li );
    },
    
    messagePrepare = function(){
        
        var box = doc.createElement('div');
        
        box.id = 'fmdjs-debug-console';
        box.style.margin = '10px 0';
        box.style.border = '1px dashed red';
        box.style.padding = '4px 8px';
        box.style.fontSize = '14px';
        box.style.lineHeight = '1.5';
        box.style.textAlign = 'left';
        
        appendTo( box );
        prepared = true;
    },
    
    appendTo = function( box ){
        
        if ( doc.body ){
            doc.body.appendChild( box );
            messageBox = doc.createElement('ol');
            messageBox.style.listStyleType = 'decimal';
            box.appendChild( messageBox );
            
            lang.forEach( messageList, function( item ){
                createMessage( item );
            } );
        } else {
            global.setTimeout( function(){
                appendTo( box );
            }, 200 );
        }
    },
    
    console = function( message, type ){
        
        var item = {
            'message': message,
            'type': type || 'log'
        };
        
        !prepared && messagePrepare();
        messageBox ?
            createMessage( item ) :
            messageList.push( item );
        
    };
    
    
    return console;
    
} );
