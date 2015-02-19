package newwwness

import (
  "net/http"
)

func init() {
  http.HandleFunc("/api/new", Sample)
}
