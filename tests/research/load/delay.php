<?php
    $delay = $_GET['sleep'];
    header('Content-type: text/javascript; charset=utf-8');
    sleep($delay);
?>
<?php
    if ( $delay < 4 ){
?>
define('delay-before',function(){
    var el = document.getElementsByTagName('div')[0];
    el.style.color = 'blue';
});
<?php
    } else {
?>
define('delay-after',function(){
    var el = document.getElementsByTagName('div')[1];
    el.style.color = 'red';
});
<?php
    }
?>
