/**
 * @module fmd.js in node
 * @author Edgar
 * @date 170213
 * */


require('../src/boot');
require('../src/utils/lang');
require('../src/event');
require('../src/config');
require('../src/module');
require('../src/injector/relative');
require('../src/injector/alias');
require('../src/loader/resolve');
require('../src/loader/assets');

require('./loader/id2uri');
require('./loader/noderequire');

fmd.version = require('../package.json').version;
fmd.config({
    basePath: process.cwd()
});

module.exports = fmd;
