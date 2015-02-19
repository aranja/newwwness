package newwwness

import (
  "net/http"
  "appengine"
  "appengine/datastore"
)

func NewArticles(w http.ResponseWriter, r *http.Request) {
  c := appengine.NewContext(r)
  q := datastore.NewQuery("Article").Limit(4)

  articles := make([]Article, 0, 4)
  if _, err := q.GetAll(c, &articles); err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  result := Result{
    Count: len(articles),
    Results: articles}

  SendJson(w, result)
}
