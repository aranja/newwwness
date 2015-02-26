package newwwness

type ArticlesResult struct {
	Articles []Article `json:"articles"`
}

type ArticleResult struct {
	Article *Article `json:"article"`
}
