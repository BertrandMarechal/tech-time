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
// todo: add a proper transaction or error management as we do 2 operations
func DeleteTodo(todoId string) error {
	var order int64
	// we first gt the current order of the todo we are trying to delete
	rows, err := db.DB.Query("SELECT \"order\" FROM todo WHERE id = $1", todoId)

	if err != nil {
		panic(err)
	}
	for rows.Next() {
		if err := rows.Scan(&order); err != nil {
			panic(err)
		}
	}

	// we delete the record
	_, err = db.DB.Query("DELETE FROM todo WHERE id = $1", todoId)

	if err != nil {
		panic(err)
	}

	// we update the records that will move up as the item is deleted
	_, err = db.DB.Query("UPDATE todo SET \"order\" = \"order\" - 1 WHERE \"order\" > $1", order)

	if err != nil {
		panic(err)
	}
	return nil
}

func UpdateTodo(todoId string, content string) (Todo, error) {
	var todo Todo
	rows, err := db.DB.Query("UPDATE todo SET date_updated = NOW(), content = $2 where id = $1 RETURNING id, content, \"order\", date_created, date_updated", todoId, content)

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