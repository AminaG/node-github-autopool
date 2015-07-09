module.exports=function(){
	return JSON.parse(require('fs').readFileSync(process.cwd() + '/settings.json').toString())
}