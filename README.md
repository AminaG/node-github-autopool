# node-github-autopool
Add a webhook to github. Every push will pull it to your server. We used zapier, to update you by email.

1. You just need to create webhook in github to your server.
2. Just run your server. And it will autopool always
3. You can define it to send you email on success or error (using webhook and zapier)

Settings can configure from settings.json:

    {
    	"repositories":
    	[{
    	"full_name":"AminaG/Webpage-Screenshot",
    	"branch":"master",
    	"directory":"c:\\git\\Webpage-Screenshot"
    	},
    	{
    	"full_name":"AminaG/node-github-autopool",
    	"branch":"master",
    	"directory":"c:\\git\\node-github-autopool"
    	}],
    "notification":{
    	"success":"https://zapier.com/hooks/catch/bg0hw1/",
    	"error":"https://zapier.com/hooks/catch/bg0hw1/"
    },
    "email":"youremail@gmail.com"
    }
