module.exports=function(directory,branch,callback){
	require('child_process').exec('git pull origin ' +  branch,{cwd:directory,timeout:30000},function(err,stdin,stdout){
		callback.apply(null,arguments)
	})
}