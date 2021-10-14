   
const path = require('path');
const log = require('intel').getLogger('sitespeedio.plugin.test_plugin');

module.exports = {
  name() {
    
    return path.basename(__dirname);
  },

  open(context, options) {
    this.make = context.messageMaker("test_plugin").make
    log.info(options.test_plugin.value)
    
  },
  processMessage(message, queue) {
    log.info("processMessage")
    queue.postMessage(this.make('test_plugin', {}))
    
  },
  close(options, errors) {
    log.info(options.test_plugin.value)
    
  }
};
