const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const { seq, cmd } = require("faqtor");

const { roll } = require("faqtor-of-rollup");
const { minify } = require("faqtor-of-uglify");
const bsync = require("faqtor-of-browser-sync");
const { watch } = require("faqtor-of-watch");
const { all } = require("faqtor-of-promise-all");

const
    bs = bsync.create("HyperOOP"),
    builtPath = "site/built",
    documenterPath = "tools/documenter",
    lessSource = "src/less/style.less",
    lessDest = `${builtPath}/css/style.css`,
    siteCfg = "build/site.toml",
    apiDocsPath = `${builtPath}/data`,
    indexSrc = "src/index.tsx",
    indexDst = `${builtPath}/js/index.js`,
    indexMinDst = `${builtPath}/js/index.min.js`,
    toClean = ["bin", builtPath],
    toWipe = toClean.concat(["./node_modules", "./.rpt2_cache"]),
    watchDebounce = 2000;

const
    rollupPlugins = [
        typescript({
            typescript: require('typescript'),
            tsconfig: "./tsconfig.json",
        }),
        resolve(),
        commonjs({
            namedExports: {
            'node_modules/scroll-into-view/scrollIntoView.js': [ 'default' ]
            }
        })
    ],
    rollupIndexCfg = {
        input: indexSrc,
        output: {
            file: indexDst,
            format: "umd",
            sourcemap: true,
        },
        plugins: rollupPlugins,    
    },
    bsConfig = {
        server: {
            injectChanges: true,
            baseDir: "site",
            reloadDebounce: 10000,
        }
    };

const less = (src, dst, rewriteURLs = "all", cleanCSS = "'--s1 --advanced --compatibility=ie8'") =>
    cmd(`lessc --rewrite-urls=${rewriteURLs} ${src} ${dst} --clean-css ${cleanCSS}`)
        .task(`building CSS file ${dst}`)
        .factor(src, dst);

const
    buildCSS = less(lessSource, lessDest),
    buildDocumenter = cmd(`tsc -p ${documenterPath}/tsconfig.json`)
        .task("building 'documenter' tool")
        .factor(`${documenterPath}/*.ts`, "bin/*.js"),
    buildDocs = cmd(`node bin/documenter.js ${siteCfg} ${apiDocsPath}`)
        .task("building API docs")
        .factor(["bin/*.js", siteCfg], `${apiDocsPath}/*.json`),
    buildIndex = roll(rollupIndexCfg)
        .task("building index.js")
        .factor(["src/**/*.ts", "src/**/*.tsx"], indexDst),
    uglify = minify(indexDst, indexMinDst)
        .factor()
        .task("minifying 'index.js'"),
    buildAllList = [buildCSS, buildDocumenter, buildDocs, buildIndex, uglify],
    build = seq(...buildAllList)
        .task("build all"),
    clean = cmd(`rimraf ${toClean.join(" ")}`),
    wipe = cmd(`rimraf ${toWipe.join(" ")}`);
    reload = bs.reload("site/**/*").factor(),
    serve = bs.init(bsConfig),
    start = seq(build, all(serve, watch(buildAllList.concat([reload]), watchDebounce)));

module.exports = { build, start, clean, wipe };