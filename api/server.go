package newwwness

import (
  "net/http"
  "github.com/go-martini/martini"
  "github.com/martini-contrib/render"
  "github.com/rs/cors"
)

func init() {
  m := martini.Classic()
  m.Use(render.Renderer())

  c := cors.New(cors.Options{
    AllowedOrigins: []string{"*"},
  })
  m.Use(c.HandlerFunc)

  article := Article{
    Title: "Drunk J Crew",
    Image: "http://i.imgur.com/XKkITfW.jpg",
    Link: "http://drunkjcrew.tumblr.com"}

  result := Result{
    Count: 4,
    Results: []Article{article, article, article, article}}

  m.Get("/", func(r render.Render) {
    r.JSON(200, result)
  })
  http.Handle("/", m)
}
