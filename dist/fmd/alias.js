fmd("alias",["config","event"],function(a,e){a.register({keys:"alias",name:"object"});e.on("alias",function(b){var c=a.get("alias"),d;c&&(d=c[b.id])&&(b.id=d)})});
