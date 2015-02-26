package newwwness

import (
	"appengine"
	"appengine/datastore"
	"math/rand"
	"net/http"
)

func getRandomArticles(c appengine.Context) ([]Article, error) {
	keys, err := datastore.NewQuery("Article").KeysOnly().Limit(100).GetAll(c, []int{})

	if err != nil {
		return nil, err
	}

	// Shuffle the keys
	for i := range keys {
		j := rand.Intn(i + 1)
		keys[i], keys[j] = keys[j], keys[i]
	}

	articles := make([]Article, 4)

	err = datastore.GetMulti(c, keys[:4], articles)

	if err != nil {
		return nil, err
	}

	for i := 0; i < len(articles); i++ {
		articles[i].Id = keys[i].IntID()
	}

	return articles, nil
}

func RandomArticles(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	articles := []Article{}

	articles, err := getRandomArticles(c)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	SendArticles(w, articles)
}
