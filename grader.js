#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = 'test';

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile)).sort();
};

var checkFile = function(webfile, checksfile) {
    var out = {};
    for (var ii in checksfile) {
	var present = webfile(checksfile[ii]).length>0;
	out[checksfile[ii]] = present;
    };
    return out;
};	

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var load_url = function(web) {
     restler.get(web).on('complete',function(result,response) {
//      console.log(result);	 
      var checkJson = checkFile(cheerio.load(result), loadChecks(program.checks));
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson); 			 
     });
};



if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_file>', 'Path to url', URLFILE_DEFAULT)
        .parse(process.argv);
    if (program.url == URLFILE_DEFAULT) {
	var checkJson = checkFile(cheerioHtmlFile(program.file), loadChecks(program.checks));
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
    else {
	var checkJson = load_url(program.url);
    };
}

else {
    exports.checkHtmlFile = checkHtmlFile;
};
