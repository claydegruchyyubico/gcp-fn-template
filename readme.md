## gcp-fn-template
### Contents
- Express multiple endpoint function setup
- Replay attack hardened token auth
- Github action deplyoment
- Some mapped promise fetches so I dont have to reinvent the wheel every fucking time

#### To use github actions
You'll need these secrets:
- `FUNCTION_NAME` => name of function
- `GOOGLE_APPLICATION_CREDENTIALS` => base64 encoded service user .json file
- `PROJECT_ID` => ID of the project that this function will live in.
- `SUMOENDPOINT` => end point URL of your sumologic logging instance

#### All these are examples of optional vars 
- `YOUR_ZENDESK_API_TOKEN`
- `YOUR_ZENDESK_EMAIL`
- `YOUR_ZENDESK_URL`
- `GITHUBAUTH`
Any push to master will fire an update.


## Running
- Clone.
- install `shyaml` (`pip insntall shyaml`) to enable easy secret.yaml creation
- run `npm install` 
	- this installs dependencies, then runs makesecret and makestart
	- makesecret creates a `secret.yaml` with test creds
	- makestart creates a `start.sh` with and reads the creds, allowing you to run the tool with temp env creds
	
if you dont wannt to do all that shit, make the start yourself (or dont!):
```
env YOUR_ZENDESK_URL='<a YOUR_ZENDESK_URL>'  \
YOUR_ZENDESK_EMAIL='<a YOUR_ZENDESK_EMAIL>'  \
YOUR_ZENDESK_API_TOKEN='<a YOUR_ZENDESK_API_TOKEN>'  \
sumoEndPoint='<a sumoEndPoint>'  nodemon --exec npm start