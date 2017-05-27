const request = require('request'),
    async = require('async'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream');

const writer = csvWriter({
    headers: ['link']
});
writer.pipe(fs.createWriteStream('links.csv'), {
    flags: 'a'
});
const MAX_WORKERS = 5;

let numCPUs = require('os').cpus().length;
let todo = [];
let queue = async.queue(processURL, MAX_WORKERS);
queue.push('https://medium.com/');
function processURL(url, callback) {
    todo.push(url);
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
                if (todo.indexOf(b[j]) === -1 && isURL(b[j])) {
                    todo.push(b[j]);
                    queue.push(b[j], err => {
                        if(err){
                            console.log(err);
                        }
                    });
                    writer.write([b[j]]);
                }
            }
            console.log(`Proccessed URL ${url}`);
            callback();
        } else {
            console.error(error);
            callback(error);
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

function isURL(url){
    // console.log(`URL Sunstring ${url.substring(0,5)}`);
    if(url.substring(0,5) === 'https'){
        return true;
    }else{
        return false;
    }
}