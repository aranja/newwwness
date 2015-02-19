package main

import (
  "net/http"
)

func main() {
  http.HandleFunc("/", Sample)
  http.ListenAndServe(":3000", nil)
}
