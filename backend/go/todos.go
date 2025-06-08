package main

import (
	"fmt"
	"net/http"
	"go-backend/todo"
	"go-backend/todo_pagination_result"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)



func getTodos(c *gin.Context) {
	var todos []todo.Todo
	rows, err := DB.Query("SELECT id, content, \"order\", date_created, date_updated from todo")
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Could not get todos"})
		panic(err)
	}

	for rows.Next() {
		var todo todo.Todo
		if err := rows.Scan(&todo.ID, &todo.Content, &todo.Order, &todo.DateCreated, &todo.DateUpdated); err != nil {
			panic(err)
		}
		todos = append(todos, todo)
	}
	result, err:= todo_pagination_result.New(todos, len(todos))
	if err != nil {
		panic(err)
	}
	
	fmt.Println("Yes")

	c.IndentedJSON(http.StatusOK, result)
}
