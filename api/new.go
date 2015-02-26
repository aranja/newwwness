package newwwness

import (
	"appengine"
	"appengine/datastore"
	"net/http"
)

func getNewArticles(c appengine.Context) ([]Article, error) {
	articles := []Article{}

	keys, err := datastore.NewQuery("Article").Order("-Created").Limit(4).GetAll(c, &articles)

	if err != nil {
		return nil, err
	}

	for i := 0; i < len(articles); i++ {
		articles[i].Id = keys[i].IntID()
	}

	return articles, nil
}

func NewArticles(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	articles, err := getNewArticles(c)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	SendArticles(w, articles)
}
