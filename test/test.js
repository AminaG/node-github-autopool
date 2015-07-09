var request=require('request')
var expect=require('chai').expect
var assert = require('chai').assert
var server=require('../server.js');
var settings=require('../settings.js')();

var port=parseInt(Math.random()*1000)+40000
server.listen(port)

var mockRequest=function(options,callback){
	arguments[0].url='http://127.0.0.1:' + port + arguments[0].url
	request(options,callback)
	// callback()
}


describe('test understand the webhook',function(){
	it('here',function(done){
		expect(1).to.equal(1);
		// done()
		mockRequest({
			url:'/?a=b',
			headers:{
				'Accept': '*\/*',
				'Connection': 'close',
				'User-Agent': 'GitHub-Hookshot\/f5d5ca1',
				'X-Github-Delivery': '86883680-266e-11e5-9432-bf5190bb39a0',
				'X-Github-Event': 'push',
				'X-Hub-Signature': 'sha1=9eb917111605b51c85802dd0e86060a23e5e4b87',
			},
			json:JSON.parse(require('fs').readFileSync(__dirname + '/testRequest1.json').toString())
		},function(err,obj,body){

			expect(err).to.be.null;
			expect(body).to.be.object;
			expect(body).to.deep.equal({branch:settings.repositories[0].branch,url:settings.repositories[0].full_name});
			done()
		})
	})
})

describe('testing pulling specific branch',function(){
	this.timeout(10000);
	it('test pool branch not exists',function(done){
		require('../pool.js')(settings.repositories[0].directory,'maste',function(err,body){
			expect(err).to.not.null;
			done();
		})
	})
	it('test pool branch exists',function(done){
		require('../pool.js')(settings.repositories[0].directory,settings.repositories[0].branch,function(err,body){
			assert.notOk(err,err);
			done();
		})
	})
})

describe('test pushed-branch',function(){
	this.timeout(10000)
	it('existsBranchPush',function(done){
		server.branchPushed(settings.repositories[0].full_name,settings.repositories[0].branch,function(err){
			assert.notOk(err,err && (err.message + err.stack))
			done();
		})
	})
	it('not-existsBranchPush',function(done){
		server.branchPushed('notexist','asd',function(err){
			assert.ok(err)
			done()
		})
	})
})