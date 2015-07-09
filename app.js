var stdio=require('stdio');
var request=require('request');
var server=require('./server.js');
var settings=require('./settings.js')();


server.listen(settings.port || 80,settings.ip)

// request({url:'127.0.0.01:80' + '/?a=b'},function(err,obj,body){
// 			expect(body.to.equal('b'))
// 			done()
// 		})