package newwwness

import (
	"net/http"
)

func init() {
	http.HandleFunc("/api/random", RandomArticles)
	http.HandleFunc("/api/new", NewArticles)
}
