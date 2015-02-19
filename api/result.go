package newwwness

type Result struct {
  Count int `json:"count"`
  Results []Article `json:"results"`
}
