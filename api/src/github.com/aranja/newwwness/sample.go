package main

import (
  "encoding/json"
  "net/http"
)

func Sample(w http.ResponseWriter, r *http.Request) {
  article := Article{
    Title: "Drunk J Crew",
    Image: "http://i.imgur.com/XKkITfW.jpg",
    Link: "http://drunkjcrew.tumblr.com"}

  result := Result{
    Count: 4,
    Results: []Article{article, article, article, article}}

  js, err := json.Marshal(result)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json")
  w.Write(js)
}
