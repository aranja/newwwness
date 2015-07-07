#  NEWWWWNESS

## Development 

Requires [Google App Engine SDK for Go](https://cloud.google.com/appengine/downloads).

Install dependencies:
`npm install`

Kick off local server at port `8080`:
`gulp server`

Deploy:
`gulp deploy --prod`

Deploy chrome extension: `gulp archive --prod --extension`  
This builds the extension package at `extension/archive.zip`  
Then login [here](https://chrome.google.com/webstore/developer/dashboard) and upload the zip.

