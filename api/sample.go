package newwwness

import (
  "net/http"
  "appengine"
  "appengine/datastore"
)

func ArticleKey(c appengine.Context) *datastore.Key {
  return datastore.NewIncompleteKey(c, "Article", nil)
}

func AddSample(w http.ResponseWriter, r *http.Request) {
  article := Article{
    Title: "Drunk J Crew",
    Image: "http://i.imgur.com/XKkITfW.jpg",
    Link: "http://drunkjcrew.tumblr.com"}

  c := appengine.NewContext(r)

  key, err := datastore.Put(c, ArticleKey(c), &article)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  SendJson(w, key)
}
