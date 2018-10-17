const fs = require('fs');
const path = require('path');
const purify = require('purify-css');
const {getOptions} = require('loader-utils');
const validationOptions = require('schema-utils');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require('postcss-url');

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

/**
 *
 * @param {*} source
 * @param {*} map
 * @param {*} meta
 */
module.exports = function(source) {
  /* eslint-disable */
  const options = getOptions(this);
  /* eslint-enable */
  validationOptions(schema, options, 'Web components css loader');
  let globalStyles = fs.readFileSync(options.path);
  let rPath = this.resourcePath;
  let cssFileName = rPath.substr(rPath.lastIndexOf('/') + 1);
  let templateName = cssFileName.replace('css', 'js');
  let templatePath = rPath.replace(cssFileName, templateName);
  let indexPath = rPath.replace(cssFileName, 'index.js');
  let callback = this.async();
  if (fs.existsSync(templatePath)) {
    let content = fs.readFileSync(templatePath);
    let indexContent = fs.existsSync(indexPath).toString() ? fs.readFileSync(indexPath) : '';
    content = indexContent + content;
    this.addDependency(templatePath);
    postcss()
    .use(atImport({
      root: path.dirname(options.path)
    }))
    .use(url({
      url: 'rebase'
    }))
    .process(globalStyles.toString(), {
      from: options.path,
      to: rPath,
      map: false
    }).then((globalCss) => {
      postcss()
      .use(atImport({
        root: path.dirname(rPath)
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(source.toString(), {
        from: rPath,
        map: false
      }).then((localCss) => {
        const combinedCss = globalCss.css + localCss.css;
        const purified = purify(content.toString(), combinedCss, {
          info: false,
          rejected: false,
          whitelist: []
        });

        callback(null, purified);
      });
    });
  } else {
    callback(null, source);
  }
};
