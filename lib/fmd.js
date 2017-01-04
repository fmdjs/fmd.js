/**
 * @module fmd.js in node
 * @author Edgar
 * @date 170104
 * */


require('../src/boot.js');
require('../src/utils/lang.js');
require('../src/event.js');
require('../src/config.js');
require('../src/module.js');
require('../src/injector/alias.js');
require('../src/injector/relative.js');
require('../src/loader/resolve.js');
require('../src/loader/assets.js');

require('./loader/id2uri.js');
require('./loader/nodeloader.js');

fmd.version = require('../package.json').version;
fmd.config({
    basePath: __dirname
});

module.exports = fmd;
