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
	var todo Todo
	var err error
	// we first get the todo to later use its current order
	todo, err = GetTodo(todoId)
	if err != nil {
		panic(err)
	}

	// we delete the record
	_, err = db.DB.Query("DELETE FROM todo WHERE id = $1", todoId)

	if err != nil {
		panic(err)
	}

	// we update the records that will move up as the item is deleted
	_, err = db.DB.Query("UPDATE todo SET date_updated = NOW(), \"order\" = \"order\" - 1 WHERE \"order\" > $1", todo.Order)

	if err != nil {
		panic(err)
	}
	return nil
}

// Delete all todos
func DeleteTodos() error {
	// we delete the record
	_, err := db.DB.Query("DELETE FROM todo WHERE 1 = 1")

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

// todo: add a proper transaction or error management as we do multiple operations
func ChangeTodoOrder(todoId string, delta int64, expectedOrder int64) (Todo, error) {
	// we first get the todo
	todo, err := GetTodo(todoId)
	if err != nil {
		panic(err)
	}

	if delta > 0 {
		// If the delta is superior to 0, we need to shift the records between the current order and the target one by -1
		_, err = db.DB.Query("UPDATE todo SET date_updated = NOW(), \"order\" = \"order\" - 1 WHERE \"order\" BETWEEN $1 AND $2", todo.Order + 1, todo.Order + delta)
		if err != nil {
			panic(err)
		}
		_, err = db.DB.Query("UPDATE todo SET date_updated = NOW(), \"order\" = \"order\" + $1 WHERE id = $2", delta, todoId)
		if err != nil {
			panic(err)
		}
	} else if delta < 0 {
		// If the delta is inferior to 0, we need to shift the records between the current order and the target one by 1 
		_, err = db.DB.Query("UPDATE todo SET date_updated = NOW(), \"order\" = \"order\" + 1 WHERE \"order\" BETWEEN $1 AND $2", todo.Order + delta, todo.Order - 1)
		if err != nil {
			panic(err)
		}
		_, err = db.DB.Query("UPDATE todo SET date_updated = NOW(), \"order\" = \"order\" + $1 WHERE id = $2", delta, todoId)
		if err != nil {
			panic(err)
		}
	}

	todo, err = GetTodo(todoId)
	if err != nil {
		panic(err)
	}
	return todo, nil
}

func GetTodo(todoId string) (Todo, error) {
	var todo Todo
	rows, err := db.DB.Query("SELECT id, content, \"order\", date_created, date_updated from todo where id = $1", todoId)
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