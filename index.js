var wkhtmltopdf = require('wkhtmltopdf');
var async = require('async');
var minimatch = require('minimatch');

var defaults = {
    pattern: "**/*.html",
    printMediaType: true,
    pageSize: "letter"
};

module.exports = function(options){
    if (typeof options === 'string') {
        options = {pattern: options};
    }
    if (typeof options !== 'object') {
        options = {};
    }
    for (var key in defaults) {
        if (!Object.hasOwnProperty.call(options, key)) {
            options[key] = defaults[key];
        }
    }
    delete options.output;
    var pattern = options.pattern;
    delete options.pattern;

    return function(files, metalsmith, done){
        var paths = Object.keys(files).filter(minimatch.filter(pattern))
        async.each(paths, makePdf.bind(null, options, files), done);
    }
}

function makePdf(options, files, path, done) {
    var sourceFile = files[path];

    var stream = wkhtmltopdf(sourceFile.contents, options);
    var buffers = []
    stream.on('data', function(part){
        buffers.push(part)
    });
    stream.on('end', function(){
        var destPath = path.replace(/[^\.]*$/i, 'pdf');
        var destFile = {
            contents: Buffer.concat(buffers)
        }
        files[destPath] = destFile;
        done();
    });
}
