package newwwness

import (
  "net/http"
)

func init() {
  http.HandleFunc("/api/new", NewArticles)
  http.HandleFunc("/api/add", AddSample)
}
