#  NEWWWNESS

## Development

Requires Go & [Google App Engine SDK for Go](https://cloud.google.com/appengine/downloads).
```
brew install go
brew install app-engine-go-64
```

Install dependencies:
```
npm install
go get github.com/gorilla/mux
go get github.com/rs/cors
```

Kick off local server at port 8080:
`gulp server`

Deploy:
`gulp deploy --prod`

Deploy chrome extension: `gulp archive --prod --extension`  
This builds the extension package at `extension/archive.zip`  
Then login [here](https://chrome.google.com/webstore/developer/dashboard) and upload the zip.
