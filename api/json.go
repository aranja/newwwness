package newwwness

import (
  "net/http"
  "encoding/json"
)

func SendJson(w http.ResponseWriter, v interface{}) {
  json, err := json.Marshal(v)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  w.Write(json)
}
