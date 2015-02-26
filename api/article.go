package newwwness

import (
	"appengine"
	"appengine/datastore"
	"time"
)

type Article struct {
	Id      int64     `json:"id" datastore:"-"`
	Title   string    `json:"title" datastore:",noindex"`
	Image   string    `json:"image" datastore:",noindex"`
	Link    string    `json:"link" datastore:",noindex"`
	Created time.Time `json:"created"`
}

func (article *Article) save(c appengine.Context) (*Article, error) {
	key, err := datastore.Put(c, article.key(c), article)

	if err != nil {
		return nil, err
	}

	article.Id = key.IntID()
	return article, nil
}

func (article *Article) key(c appengine.Context) *datastore.Key {
	if article.Id == 0 {
		article.Created = time.Now()
		return datastore.NewIncompleteKey(c, "Article", nil)
	}
	return datastore.NewKey(c, "Article", "", article.Id, nil)
}
