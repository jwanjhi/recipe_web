let http = require ('http');
let fs = require('fs');

http.createServer(function(req,res){
	fs.readFile('demo_readFile.html',function(err,data){
		res.writeHead(200,{'Content-type':'text/html'})
		res.write(data);
		res.end();
	});
}).listen(83);