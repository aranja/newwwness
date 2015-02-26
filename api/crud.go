package newwwness

import (
	"appengine"
	"appengine/datastore"
	"encoding/json"
	"github.com/gorilla/mux"
	"io"
	"net/http"
	"strconv"
)

type HandlerFunc func(w http.ResponseWriter, r *http.Request)

type ArticlesHandlerFunc func(c appengine.Context) ([]Article, error)

type ArticleHandlerFunc func(c appengine.Context, key *datastore.Key) (*Article, error)

func makeHandler(f ArticlesHandlerFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		result, err := f(ctx)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		SendArticles(w, result)
	}
}

func makeHandlerWithParameter(f ArticleHandlerFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)

		vars := mux.Vars(r)

		id, err := strconv.ParseInt(vars["id"], 10, 64)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		key := datastore.NewKey(ctx, "Article", "", id, nil)

		result, err := f(ctx, key)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		SendArticle(w, result)
	}
}

func decodeArticle(r io.ReadCloser) (*Article, error) {
	defer r.Close()
	var article Article
	err := json.NewDecoder(r).Decode(&article)
	return &article, err
}

func createArticle(c appengine.Context, body io.ReadCloser) (*Article, error) {
	article, err := decodeArticle(body)

	if err != nil {
		return nil, err
	}

	return article.save(c)
}

func getAllArticles(c appengine.Context) ([]Article, error) {
	articles := []Article{}
	keys, err := datastore.NewQuery("Article").Order("Created").GetAll(c, &articles)

	if err != nil {
		return nil, err
	}

	for i := 0; i < len(articles); i++ {
		articles[i].Id = keys[i].IntID()
	}

	return articles, nil
}

func getArticle(c appengine.Context, key *datastore.Key) (*Article, error) {
	article := new(Article)

	err := datastore.Get(c, key, article)

	if err != nil {
		return nil, err
	}

	article.Id = key.IntID()

	return article, nil
}

func deleteArticle(c appengine.Context, key *datastore.Key) error {
	return datastore.Delete(c, key)
}
