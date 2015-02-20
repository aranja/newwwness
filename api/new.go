package newwwness

import (
  "math/rand"
  "net/http"
  "appengine"
  "appengine/datastore"
)

func NewArticles(w http.ResponseWriter, r *http.Request) {
  c := appengine.NewContext(r)
  q := datastore.NewQuery("Article").KeysOnly().Limit(100)

  keys, err := q.GetAll(c, []int{})

  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  // Shuffle the keys
  for i := range keys {
    j := rand.Intn(i + 1)
    keys[i], keys[j] = keys[j], keys[i]
  }

  articles := make([]Article, 4)

  if err := datastore.GetMulti(c, keys[:4], articles); err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  result := Result{
    Count: len(articles),
    Results: articles}

  SendJson(w, result)
}
