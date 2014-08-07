var https = require("https");

function getRepos(username, callback) {
	var options = {
		host: 'api.github.com',
		path: '/users/' + username + '/repos',
		method: 'GET',
		headers: {'user-agent': 'node.js'}
	};

	var request = https.request(options, function(response) {
		var user = '';
		response.on("data", function(chunk) {
			user += chunk.toString();
		});
		response.on("end", function() {
			var repos = [];
			var json = JSON.parse(user);
			if(json.message == 'Not Found') {
				callback(false);
			} else {
				for (var repo in json) {
					//console.log("Name:" + repo.name + "\nDes: " + repo.description);
					repos.push({
						name: json[repo].name,
						description: json[repo].description
					});
				};

				callback(repos);
			}
		});
		response.on("error", function() {
			callback(false);
		})
	});
	request.on("error", function(error) {
		console.log("ERROR: " + error.message); 
		callback(false);
	});
	request.end();
};

var argumentLength = process.argv.length;
if(argumentLength < 3 || process.argv.slice(2).toString()[0] != '-') {
	console.log("node githubRepos -username");
	console.log("ex: node githubRepos -bintricks");
} else {
	var username = process.argv.slice(2).toString().substring(1);
	getRepos(username, function(repos) {
		if(repos) {
			repos.forEach(function(repo){
				console.log("Name: " + repo.name);
			});
		} else {
			console.log("invalid username");
		}
	});
}