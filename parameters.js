module.exports.options=function(){
		return stdio.getopt({
		ip:{
			key:'ip',
			mandatory:true
		},
		port:{
			key:'port',
		},	
	})
}