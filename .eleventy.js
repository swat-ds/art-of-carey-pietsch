const fs = require('fs-extra');
const sass = require('sass');
const MarkdownIt = require('markdown-it');
const settings = require('./settings.json');

module.exports = function(eleventyConfig) {

  /* * * settings * * */
  let md = new MarkdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary('md', md);
  eleventyConfig.addWatchTarget('src/_sass/');

  /* * * passthrough paths * * */
  eleventyConfig.addPassthroughCopy('src/assets/css/*css');
  eleventyConfig.addPassthroughCopy('src/assets/js/*js');
  eleventyConfig.addPassthroughCopy('src/assets/fonts');
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy( {'src/icons/*': '/'} );

  eleventyConfig.addPassthroughCopy( {'node_modules/viewerjs/dist/*min.css': '/assets/css/'} );
  eleventyConfig.addPassthroughCopy( {'node_modules/plyr/dist/*min.css': '/assets/js/'} );

  // adds any node packages in settings.json build.loadJS array
  settings.build.loadJS.forEach( (d) => {
    if (d.nodePkg) {
      eleventyConfig.addPassthroughCopy( { 
        [`node_modules/${d.nodePkg}/dist/*min.js`]: '/assets/js/'
      });
    }
  });

  /* * * filters * * */
  // example custom filter, returns thumbnail path from filename
  eleventyConfig.addFilter('thumbify', (d) => {
    if (d !== undefined) {
      let thumbPath = `thumbs/${d.split('.')[0]}-sm.`;
      thumbPath += (d.split('.')[1] === 'mp4') ? 'jpg' : d.split('.')[1];
      return thumbPath;
    } else { return ''; }
  });
  // unnecessary custom filter for returning min.js file from node pkg dist
  // folder from build.loadjs array, implemented in footer_scripts.html
  eleventyConfig.addFilter('getNodeMinJS', (d) => {
      return fs.readdirSync(`node_modules/${d}/dist`)
                .filter( d => d.includes('.min.js'))[0]
  });
  eleventyConfig.addFilter( 'markdownify', d => md.render(d || '') );
  // [h/t @edjw](https://edjohnsonwilliams.co.uk/2019/05/04/replicating-jekylls-markdownify-filter-in-nunjucks-with-eleventy/)

  eleventyConfig.addFilter('jsonify', (d) => {
    return JSON.stringify(d);
  });

  eleventyConfig.on('beforeBuild', () => {
    // Compile Sass
    let result = sass.renderSync( {
      file: 'src/_sass/main.scss',
      sourceMap: false,
      outputStyle: 'expanded',
    });
    console.log('SCSS compiled 💪');
    fs.outputFile('dist/assets/css/main.css', result.css)
  });

  /* * * return build * * */
  return {
    // set input and output paths
    
    dir: {
    input: settings.build.inputDirectory,
    output: settings.build.outputDirectory
  },

    pathPrefix: settings.build.pathPrefix
  };
};