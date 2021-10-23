const { sourceNodes } = require('./dist/source-nodes');
const { onPreInit } = require('./dist/plugin-options');

// exports.pluginOptionsSchema = pluginOptionsSchema;
exports.onPreInit = onPreInit;
exports.sourceNodes = sourceNodes;
