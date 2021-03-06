var fs   = require('fs');
var glob = require('glob');
var path = require('path');

/**
 * Looks for files with the .js extension within the given directory, and attempts to add them as Handlebars helpers.
 * @param {string} dir - Folder to check for helpers.
 */
module.exports = function(dir) {
  var helpers = glob.sync(path.join(dir, '**/*.js'));

  for (var i in helpers) {
    var helper;
    var name = path.basename(helpers[i], '.js');

    try {
      if(this.Handlebars.helpers[name]){
        delete require.cache[require.resolve(path.join(helpers[i]))];
        this.Handlebars.unregisterHelper(name);
      }
      helper = require(path.join(helpers[i]));
      this.Handlebars.registerHelper(name, helper);
    }
    catch (e) {
      console.warn('Error when loading ' + name + '.js as a Handlebars helper.');
    }
  }
}