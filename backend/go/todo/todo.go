package todo

type Todo struct {
	ID          int64   `json:"id"`
	Content     string  `json:"content"`
	Order       int64   `json:"order"`
	Price       float64 `json:"price"`
	DateCreated string  `json:"date_created"`
	DateUpdated string  `json:"date_updated"`
}

// func New(text string) (Todo, error) {

// 	if text == "" {
// 		return Todo{}, errors.New("Invalid input")
// 	}

// 	return Todo{
// 		Text: text,
// 	}, nil
// }

// func (todo Todo) Save() error {
// 	fileName := "todo.json"

// 	json, err := json.Marshal(todo)
// 	if err != nil {
// 		return err
// 	}

// 	return os.WriteFile(fileName, json, 0644)
// }

// func (todo Todo) Display() {
// 	fmt.Printf("Todo:\n\n%v\n", todo.Text)
// }
