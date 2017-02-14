/**
 * @module fmd.js in node
 * @author Edgar
 * @date 170214
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

require('./loader/id2url');
require('./loader/noderequire');

fmd.version = require('../package.json').version;

module.exports = fmd;
