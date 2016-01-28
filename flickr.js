var	http = require('http'), url = require('url'), fs = require('fs'), qs = require('querystring'), https = require('https');
  
http.createServer(function (req, res) {
	var request_url = url.parse(req.url);
	var request_search = url.parse(decodeURI(req.url), true).query.search;
	var request_page = url.parse(decodeURI(req.url), true).query.page;

  	if (request_search) {
  		res.writeHead(200, {'Content-Type': 'application/json'});

		fl_op = qs.stringify({
			'api_key': 'eac9421b0087e460213b6a4fea4837c0',
			'extras' : 'description',
			'format' : 'json',
			'method' : 'flickr.photos.search',
			'nojsoncallback': '1',
			'per_page' : 5,
			'page' : request_page,
			'tags' : request_search
		});

		https.get('https://api.flickr.com/services/rest/?' + fl_op, function(flickr_api_response) {
			var body = '';
			flickr_api_response.on('data', function(d) {
				body += d;
			});
			flickr_api_response.on('end', function (data) {
				res.end(body)
			});
		});
  	}

	if (request_url.pathname != '/' && !request_search) {
		fs.readFile('.'+request_url.pathname, function(err, data) {
			if (!err)
				res.end(data);
		});
	}

}).listen(8888, 'localhost');

console.log('Flickr-gallery webpage: http://localhost:8888/flickr.html');