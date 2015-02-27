package newwwness

import (
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"net/http"
)

func init() {
	c := cors.New(cors.Options{})
	http.Handle("/api/", c.Handler(CreateHandler()))
}

func CreateHandler() http.Handler {
	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()

	api.HandleFunc("/random", RandomArticles)
	api.HandleFunc("/new", NewArticles)

	//api.HandleFunc("/articles", makeHandler(getAllArticles)).Methods("GET")
	//api.HandleFunc("/articles/{id}", makeHandlerWithParameter(getArticle)).Methods("GET")
	//api.HandleFunc("/articles", makeHandler(createArticle)).Methods("POST")
	//api.HandleFunc("/articles/{id}", makeHandler(updateArticle)).Methods("PUT")
	//api.HandleFunc("/articles/{id}", makeHandlerWithParameter(deleteArticle).Methods("DELETE"))

	return api
}
