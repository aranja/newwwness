package newwwness

import (
	"encoding/json"
	"net/http"
)

func SendJson(w http.ResponseWriter, v interface{}) error {
	return json.NewEncoder(w).Encode(v)
}

func SendArticles(w http.ResponseWriter, articles []Article) {
	result := ArticlesResult{
		Articles: articles}

	SendJson(w, result)
}

func SendArticle(w http.ResponseWriter, article *Article) {
	result := ArticleResult{
		Article: article}

	SendJson(w, result)
}
