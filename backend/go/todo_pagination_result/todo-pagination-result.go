package todo_pagination_result

import (
	"go-backend/todo"
)

type TodoPaginationResult struct {
	Data      []todo.Todo   `json:"data"`
	Total     int64  `json:"total"`
	Origin    string  `json:"origin"`
}

func New(data []todo.Todo, total int64) (TodoPaginationResult, error) {
	return TodoPaginationResult{
		Data: data,
		Total: total,
		Origin: "go",
	}, nil
}