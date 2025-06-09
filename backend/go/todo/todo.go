package todo

import (
	"errors"
	"go-backend/db"
)

type Todo struct {
	ID          int64   `json:"id"`
	Content     string  `json:"content"`
	Order       int64   `json:"order"`
	DateCreated string  `json:"dateCreated"`
	DateUpdated string  `json:"dateUpdated"`
}

func New(content string) (Todo, error) {
	if content == "" {
		return Todo{}, errors.New("Invalid input")
	}

	var todo Todo
	rows, err := db.DB.Query("insert into todo (content, \"order\", date_created, date_updated) VALUES ($1, (SELECT COALESCE(MAX(\"order\"), 0) from todo) + 1, NOW(), NOW()) RETURNING id, content, \"order\", date_created, date_updated", content)
	if err != nil {
		panic(err)
	}
	for rows.Next() {
		if err := rows.Scan(&todo.ID, &todo.Content, &todo.Order, &todo.DateCreated, &todo.DateUpdated); err != nil {
			panic(err)
		}
	}

	return todo, nil
}

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
