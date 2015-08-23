var wkhtmltopdf = require('wkhtmltopdf');
var async = require('async');
var minimatch = require('minimatch');
var _ = require('lodash');
var http = require('http');
var debug = require('debug')('metalsmith-pdf');

var defaults = {
    pattern: "**/*.html",
    encoding: "utf-8"
};

module.exports = function(options){
    if (typeof options === 'string') {
        options = {pattern: options};
    }
    options = _.defaults({}, options, defaults);
    delete options.output;
    var pattern = options.pattern;
    delete options.pattern;

    return function(files, metalsmith, done){
        var paths = Object.keys(files).filter(minimatch.filter(pattern));

        var server = http.createServer(serveFiles(files));
        server.listen(0, '127.0.0.1', function(){
            debug("Started HTTP server on port %d", server.address().port);
            async.each(paths, makePdf.bind(null, options, server.address(), files), function(){
                server.close();
                debug("Stopped HTTP server");
                done();
            });
        });
    }
}

function makePdf(options, host, files, path, done) {
    debug("Generating PDF from %s", path)

    var sourceUrl = "http://"+host.address+":"+host.port+"/"+path;
    var stream = wkhtmltopdf(sourceUrl, options);
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
        debug("Successfully generated %s", destPath)
        done();
    });
}

function serveFiles(files) {
    return function(req, res) {
        debug("%s %s", req.method, req.url);
        if (req.method !== 'GET') {
            res.writeHead(405); // method not allowed
            return res.end();
        }
        var path = req.url.replace(/^\//, '');
        var file = files[path];
        if (!file) {
            res.writeHead(404); // file not found
            return res.end();
        }
        res.writeHead(200);
        res.end(file.contents);
    }
}
