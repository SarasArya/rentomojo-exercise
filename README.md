Question

__Problem Statement:__  

Crawl popular blogging website https://medium.com and find all possible hyperlinks present within https://medium.com website and generate a CSV output.  

__You need to__

a. use Node.js for scripting.  
b. throttle the requests made to medium.com at max 5 requests at a time.  
c. use asynchronous nature of javascript as much as possible.  
d. Using Git with proper commit and readme file is a plus.  
e. Share two versions of the assignment - One using async library and the other without.  

Notes:

1. Don’t spam medium.com servers with too many requests, their servers might ban your ip  
2. At all times the concurrency count should be equal to 5  
3. If you are using request.js, you are not allowed to use its connection pool  
4. Don’t use any external scraping library  
5. You are not allowed to use throttled-request package to limit the number of connections  

__What is crawling?__
You scrape https://medium.com, you get a certain number of links, you need to recursively
scrape those pages too to get further more links.

__Detailed explanation on point ‘b’__

Let’s say the first request to medium.com gives you 100 links  
You’ll fire the first 5 requests using the 1st 5 links (concurrency = 5)  
Now one of them finishes (concurrency = 4), but because we need 5 concurrent requests at all time, you’ll fire one more request with the 6th url in the list, making the concurrency = 5 again.  
This goes on till all the links get exhausted.  

__Submission__  

It is mandatory to submit the assignment in a git repo. You can use GitHub, BitBucket or GitLab.

Solution

1. The problem has been solved considering all the above contraints.  
2. The async task(app-with-async.js) uses async.queue to process request. The concurrency has been handled by the concurrency parameter in async.queue. Documentation is available [here](http://caolan.github.io/async/docs.html#queue)
3. The app-without-async.js task uses a counter to make sure that concurrency is maintained.
4. Generates all the data in links.csv file

Todo
1. add Test cases