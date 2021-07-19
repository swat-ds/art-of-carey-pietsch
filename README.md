# Art of Carey Pietsch

Exhibit site based on Hyper Local Eleventy theme featuring art work of comic artist Carey Pietsch hosted in McCabe Library, Swarthmore College 2021.

[Explore the exhibit site here](https://ds-pages.swarthmore.edu/art-of-carey-pietsch/).

## [Hyper Local Eleventy Project](https://github.com/swat-ds/every-holly-pentacle)

Eleventy Project designed for Swarthmore Libraries Book Arts exhibits with aspirations to be a template theme for future online exhibits. Similar in scope to Jekyll projects [Wax](https://github.com/minicomp/wax) and [CollectionBuilder](https://github.com/CollectionBuilder/collectionbuilder-sa). 

## Why?

Issue reconciling Pagemaster gem, Ruby, and Jekyll versions spurred me to consider other options. Hit my limit maintaining rvm Ruby versions and local/global gem compatibility.

- "For all my time using Jekyll, I would think to myself 'this, but in Node'." -- [Paul Lloyd](https://24ways.org/2018/turn-jekyll-up-to-eleventy)
- Growing community around this tool, but in general decline of Ruby in web dev
- Most objects can be templates or scripts, which increases flexibility
- Collection building is not a poorly maintained plugin but core feature
- Much faster
- Fits more easily within existing node web dev chain

This project makes use of several eleventy features:

- Custom filters (`addFilter`)
- Collection pages and collection data object from JSON file (`pagination`)
- Transformed collection data fields (`eleventyComputed`)
- Explicit file copy paths (`addPassthroughCopy`)
- Site data
- Computed URLs and paths (`url`, `pathPrefix`)
- Register shortcodes for layout defaults (`addLayoutAlias`)
- Set Markdown It markdown parser options
- ~~Sass and eleventy dev and build scripts in `package.json`~~
- Sass implemented in Eleventy build

***light(ish)!***

- [Milligram](https://milligram.io/)
- [Normalize](https://necolas.github.io/normalize.css/)
- [Eleventy](https://www.11ty.dev)

There are more minimal approaches but this is the minimum for our requirements. Milligram chosen for `flexbox` column layout.

***features!***

- [viewerjs](https://github.com/fengyuanchen/viewerjs)
- jQuery (sigh, just makes things easier)
- Minimal scrollview jQuery function
- [Favicons/PWA App Icons](https://www.favicon-generator.org/)

## Usage

- Site and build settings in `/settings.json`
- `npm install --save-dev`
- `npx eleventy --serve` (for development)
- `npx eleventy`

### Data

- JSON file in `_data` folder
- Google Sheets feeds API (v3, so may :sunset:)
- Whatever Eleventy plugin you can imagine

### Todo :white_check_mark:

- [ ] Cache busting
- [ ] Search, e.g. [this strategy by @cfjedimaster](https://www.raymondcamden.com/2021/01/22/using-pre-built-lunr-indexes-with-eleventy)
- [ ] Image processing
- [ ] Static CMS
- [ ] Testing
- [x] Integrate sass into Eleventy build
- [ ] Head meta best practices for Zotero, Hypothesis, SEO, etc.
- [ ] Simple category filter

#### Detritus

- regex to capture filenames alone
  - `\{[\n ]+"id"[\w\W]+?"filename": (.+)[\w\W]+?\s{10}\}\n\s{8}\}`
- Airtable, visit generated table API Docs create API key and access via `curl` then transform.
- `d = data.map(function(d) { d.fields.Photos = d.fields.Photos.map(function(e) { return e.filename }); return d; })`
- Image transform 
  - `magick mogrify -path OUTPUT_PATH -filter Triangle -define filter:support=2 -thumbnail OUTPUT_WIDTH -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip INPUT_PATH`