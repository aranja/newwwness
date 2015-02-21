package newwwness

import (
	"time"
)

type Article struct {
	Title   string    `json:"title"`
	Image   string    `json:"image"`
	Link    string    `json:"link"`
	Created time.Time `json:"created"`
}
