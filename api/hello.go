package api

import (
    "appengine"
    "appengine/datastore"
    "appengine/user"
    "encoding/json"
    "fmt"
    "github.com/gohttp/app"
    "github.com/gohttp/response"
    "net/http"
    "time"
)

type Page struct {
    PageURL     string      `json:"page_url"`
    PageTitle   string      `json:"page_title"`
    ImageURL    string      `json:"image_url"`
    SubmitDate  time.Time   `json:"submit_date"`
}

// recentPagesKey returns the key where recent pages are stored.
func recentPagesKey(c appengine.Context) *datastore.Key {
    return datastore.NewKey(c, "Pages", "recent_pages", 0, nil)
}

func init() {
    a := app.New()

    a.Get("/", func(w http.ResponseWriter, r *http.Request) {
        c := appengine.NewContext(r)
        u := user.Current(c)
        if u == nil {
            url, err := user.LoginURL(c, r.URL.String())
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            w.Header().Set("Location", url)
            w.WriteHeader(http.StatusFound)
            return
        }
        fmt.Fprintf(w, "Hello, %v!", u)
    })

    a.Get("/api/pages", func(w http.ResponseWriter, r *http.Request) {
        c := appengine.NewContext(r)
        query := datastore.NewQuery("Page").Ancestor(recentPagesKey(c)).Order("-SubmitDate").Limit(4)
        pages := make([]Page, 0, 10)
        if _, err := query.GetAll(c, &pages); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
        }

        response.OK(w, pages)
    })

    a.Post("/api/pages", func(w http.ResponseWriter, r *http.Request) {
        c := appengine.NewContext(r)

        page := Page{}
        dec := json.NewDecoder(r.Body)
        err := dec.Decode(&page)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        page.SubmitDate = time.Now()
        key := datastore.NewIncompleteKey(c, "Page", recentPagesKey(c))
        _, err = datastore.Put(c, key, &page)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        response.Created(w, page)
    })

    http.Handle("/", a)
}
