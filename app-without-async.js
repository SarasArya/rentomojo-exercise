const request = require('request'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream');

const writer = csvWriter({
    headers: ['link']
});
writer.pipe(fs.createWriteStream('links.csv'), {
    flags: 'a'
});
let todo = [];
let running = 0;
const MAX_WORKERS = 5;
const MAX_LIMIT = 10000000;

todo.push('https://medium.com/');

function process() {
    const url = todo.shift();
    running++;
    request(url, (error, response, html) => {
        if (!error) {
            const $ = cheerio.load(html);
            let arr = [];
            $('a').filter(function(output) {
                let data = $(this);
                arr.push(data.attr().href);
            });

            let b = removeDuplicates(arr);
            for (let j = 0; j < b.length; j++) {
                if (todo.indexOf(b[j]) === -1) {
                    todo.push(b[j]);
                    writer.write([b[j]]);
                }
            }
            while (todo.length && running < MAX_WORKERS) {
                process(); // start more workers
            }
            running--;
        }else{
        	console.error(error);
        }
    });
}

function removeDuplicates(arr) {
    var uniqueLinks = [];
    arr.forEach(element => {
        if (uniqueLinks.indexOf(element) === -1) {
            uniqueLinks.push(element);
        }
    });
    return uniqueLinks;
}

process();
