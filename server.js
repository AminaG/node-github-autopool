var express=require('express');
var request=require('request');
var app=express();

settings=require('./settings.js')()

app.use('/',require('body-parser').json())
app.use('/',function(req,res){
	var branch=req && req.body && req.body.ref && req.body.ref.replace(/.*\/(.*)/,'$1')
	if(!branch) {
		res.end();
		return;
	}
	var url=req.body && req.body.repository.full_name;
	if(!url){
		res.end();
		return;
	}
	res.write(JSON.stringify({
		branch:branch,
		url:url
	}));
	module.exports.branchPushed(url,branch,function(){})
	res.end()
})

module.exports.listen=function(port,ip){
	app.listen(port || 80,ip)
}

module.exports.branchPushed=function(url,branch,callback){
	for(var i=0;i<settings.repositories.length;i++){
		if (
			settings.repositories[i].full_name.toLowerCase()==url.toLowerCase() &&
			settings.repositories[i].branch.toLowerCase()==branch.toLowerCase()
		){
			var pool=require('./pool.js')(settings.repositories[i].directory,branch,function(err,stdin,stdout){
				console.log(new Date(),stdout)
				if(err && settings.notification.error){
					request.post({
						url:settings.notification.error,
						json:{
							subject:'error:' + url + ' ,' + branch,
							body:stdout,
							from:'node-github-autopool',
							to:settings.email,
						}
					},function(_err,body){
						callback(err)
					})
				}
				if(!err && settings.notification.success){
					request.post({
						url:settings.notification.success,
						json:{
							subject:'node-github-autopool success:' + url + ' ,' + branch,
							body:stdout,
							from:'node-github-autopool',
							to:settings.email
						}
					},function(_err,body){
						callback(err)
					})
				}
			})			
			return;
		}
	}
	callback(new Error('branch not found in settings'))
}