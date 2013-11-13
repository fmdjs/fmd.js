/*! fmd.js v0.2.0 | http://fmdjs.org/ | MIT */
(function(e){if(!e.fmd){var n={},t=function(e){return n[e]},r=function(e,r,i){if(!n[e]){if(i||(i=r,r=[]),"function"==typeof i){for(var o=[],u=0,c=r.length;c>u;u++)o.push(t(r[u]));i=i.apply(null,o)}n[e]=i||1}};r.version="0.2.0",r.cache={},r("global",e),r("require",function(){return t}),r("env",function(){return r}),r("cache",function(){return r.cache}),e.fmd=r}})(this),fmd("lang",function(){var e={}.toString,n=Array.prototype,t={isFunction:function(n){return"[object Function]"===e.call(n)},isArray:Array.isArray||function(n){return"[object Array]"===e.call(n)},isString:function(e){return"string"==typeof e},forEach:n.forEach?function(e,n,t){e.forEach(n,t)}:function(e,n,t){for(var r=0,i=e.length;i>r;r++)n.call(t,e[r],r,e)},map:n.map?function(e,n,t){return e.map(n,t)}:function(e,n,r){var i=[];return t.forEach(e,function(e,t,o){i.push(n.call(r,e,t,o))}),i},inArray:n.indexOf?function(e,n){return e.indexOf(n)}:function(e,n){for(var t=0,r=e.length;r>t;t++)if(e[t]===n)return t;return-1}};return t}),fmd("event",["env","cache"],function(e,n){var t=n.events={},r=[].slice,i={on:function(e,n){var r=t[e]||(t[e]=[]);r.push(n)},emit:function(e){var n,i=r.call(arguments,1),o=t[e],u=0;if(o)for(;n=o[u++];)n.apply(null,i)},off:function(e,n){var r=t[e];if(r)if(n)for(var i=r.length-1;i>=0;i--)r[i]===n&&r.splice(i,1);else delete t[e]}};return e.on=i.on,e.off=i.off,i}),fmd("config",["env","cache","lang"],function(e,n,t){var r=n.config={},i=n.configRules={},o="_rule_",u=0,c=function(e,n,o){var u,c=!1;for(var a in i){if(c)break;u=i[a],c=t.inArray(u.keys,n)>-1&&void 0===u.rule.call(r,e,n,o)}return c},a={get:function(e){return r[e]},set:function(e){for(var n in e){var t=r[n],i=e[n];c(t,n,i)||(r[n]=i)}},register:function(e){var n;return t.isFunction(e.rule)&&(e.name||(e.name=o+u++),n=i[e.name]={rule:e.rule,keys:[]}),n||(n=i[e.name]),n&&e.keys&&(t.isArray(e.keys)?n.keys=n.keys.concat(e.keys):n.keys.push(e.keys)),this}};return a.register({name:"object",rule:function(e,n,t){if(!e)return!1;for(var r in t)e[r]=t[r]}}).register({name:"array",rule:function(e,n,t){e?e.push(t):this[n]=[t]}}),e.config=function(e){return t.isString(e)?a.get(e):(a.set(e),void 0)},a}),fmd("module",["global","env","cache","lang","event"],function(e,n,t,r,i){var o,u="",c=[],a="_!_fmd_anonymous_",f=0,s=t.modules={},l={require:function(e){return e.require=function(e){return d.require(e)},i.emit("makeRequire",e.require,e),e.require},exports:function(e){return e.exports},module:function(e){return e.module={id:e.id,exports:e.exports},e.module}},d=function(e,n,t){var r=this;r.id=e,r.deps=n||[],r.factory=t,r.exports={},r.unnamed()&&(e=a+f,f++),r.uid=e};d.prototype={unnamed:function(){return this.id===u},extract:function(){var e=this,n=e.deps,t=[];return r.isArray(n)&&r.forEach(n,function(n){var r,i;r=(i=l[n])?i(e):d.require(n),t.push(r)}),t},compile:function(){var e=this;try{if(r.isFunction(e.factory)){var n=e.extract(),t=e.factory.apply(null,n);t!==o?e.exports=t:e.module&&e.module.exports&&(e.exports=e.module.exports),e.module&&delete e.module}else e.factory!==o&&(e.exports=e.factory);i.emit("compiled",e)}catch(u){i.emit("compileFailed",u,e)}},autocompile:function(){this.unnamed()&&this.compile()}},d.get=function(e){var n={id:e};return i.emit("alias",n),s[n.id]},d.has=function(e){return d.get(e)||l[e]?!0:!1},d.save=function(e){s[e.uid]=e,i.emit("saved",e),e.autocompile()},d.require=function(e){var n=d.get(e);return n?(n.compiled||(n.compiled=!0,n.compile()),i.emit("required",n),n.exports):(i.emit("requireFailed",{id:e}),null)},d.define=function(e,n,t){var o=arguments.length;return 1===o?(t=e,e=u):2===o&&(t=n,n=c,r.isString(e)||(n=e,e=u)),d.has(e)?(i.emit("existed",{id:e}),null):(d.save(new d(e,n,t)),void 0)};var m=e.define;return n.noConflict=function(){e.define=m},n.define=e.define=d.define,d}),fmd("alias",["config","event"],function(e,n){var t="alias";e.register({keys:t,name:"object"}),n.on(t,function(n){var r,i=e.get(t);i&&(r=i[n.id])&&(n.id=r)})});