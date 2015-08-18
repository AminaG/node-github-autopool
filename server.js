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
					sendNotification(settings.notification.error,'error:' + url + '/' +branch,stdout,callback)
				}
				if(!err && settings.notification.success){
					sendNotification(settings.notification.url,'success:' + url + '/' +branch,stdout,callback)					
				}
			})			
			return;
		}
	}
	callback(new Error('branch not found in settings'))
}

function sendNotification(url,subject,body,callback){
	if(settings.notification.type=='zapier')
		request.post({
				url:url,
				json:{
					subject:subjcet,
					body:stdout,
					from:'node-github-autopool',
					to:settings.notification.email
				}
			},function(_err,body){
				callback(err)
			})
	else if(settings.notification.type=='pushbullet')
		request.post({
				url:'https://api.pushbullet.com/v2/pushes',
				headers:{
				'Authorization': 'Bearer ' + settings.notification.access_token
				},
				json:{
					"type": "note", 
					"title": "AutoPool:" + subject,
					"body":body
				}
			},function(err,obj,body){
			})
}