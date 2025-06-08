package todo_pagination_result

import (
	"go-backend/todo"
)

type TodoPaginationResult struct {
	Data      []todo.Todo   `json:"data"`
	Total     int  `json:"total"`
}

func New(data []todo.Todo, total int) (TodoPaginationResult, error) {
	return TodoPaginationResult{
		Data: data,
		Total: total,
	}, nil
}