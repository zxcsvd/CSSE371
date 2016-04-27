var http = require('http'),
dispatcher = require('./httpdispatcher');
url = require("url"),
path = require("path"),
fs = require("fs");

PORT = process.argv[2] || 8888; 


function handleRequest(request, response){//called whenever a clients requests data from our server
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

function renderPath(request,response){//outputs file contents corresponding to request to buffer response
    var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd()+'/content', uri);
    exists = path.existsSync(filename);
    if(!exists) {
	response.write("404 Not Found\n");
	return;
    }
    
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
    
    file = fs.readFileSync(filename, "binary");
    response.write(file, "binary");
}	   

function renderHTML(req,res){
    var uri = url.parse(req.url).pathname;
    q = url.parse(req.url,true).query;
    switch(uri){
    case "/landing.html":
	res.writeHead(200, {'Content-Type': 'text/html'});
	renderPath(req,res);
	res.write("x + y = " + (parseInt(q.x) + parseInt(q.y)).toString());
	//an example of using GET variables
	res.end();
    }
}

		    
dispatcher.setStatic('resources');

//give out html/css/js files whenever
dispatcher.onGet(/\//, function(req, res) {
    var uri = url.parse(req.url).pathname;
    pth = path.join(process.cwd() + '/content', uri);
    exists = path.existsSync(pth);
    if(!exists) {
	res.end();
	return;
    }
    if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'
	renderHTML(req,res);
	return;
	/*fs.readFile(pth, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
	});*/
	
    }
    
    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
	
	fs.readFile(pth, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
	});
	
    }
    
    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

	fs.readFile(pth, function (err, data) {
        if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
        res.end();
	});
	
    }
});	

//render the landing page
dispatcher.onGet("/landing.html", function(req, res) {
    q = url.parse(req.url,true).query;
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderPath(req,res);
    res.write("x + y = " + (parseInt(get.x) + parseInt(get.y)).toString());//an example of using GET variables
    res.end();
});    


dispatcher.onPost("/post1", function(req, res) {//this is included to show the onPost method in use
    //anything in here works just like it would in onGet
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Got Post Data');
});


var server = http.createServer(handleRequest);


server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
