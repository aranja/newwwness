package newwwness

import (
  "net/http"
)

func init() {
  http.HandleFunc("/", Sample)
}
