package main

import (
	"fmt"
	// "strconv"
	"net/http"
	"go-backend/todo"
	"go-backend/todo_pagination_result"
	"go-backend/db"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type TodoRequestBody struct {
    Content string
}

func getTodos(c *gin.Context) {
    size := c.DefaultQuery("size", "25")
    from := c.DefaultQuery("from", "0")
    sort := c.DefaultQuery("sort", "date_created")
    direction := c.DefaultQuery("direction", "asc")
    text := c.DefaultQuery("text", "")
	sortAndDirection := fmt.Sprintf("%s %s", sort, direction)

	var todos []todo.Todo

	fmt.Printf("sortAndDirection: %s", sortAndDirection)

	rows, err := db.DB.Query("SELECT id, content, \"order\", date_created, date_updated from todo where ('' = $4 or content ilike '%' || $4 || '%') order by case when 'content asc' = $1 then content end asc, case when 'order asc' = $1 then \"order\" end asc, case when 'date_created asc' = $1 then \"date_created\" end asc, case when 'content desc' = $1 then content end desc, case when 'order desc' = $1 then \"order\" end desc, case when 'date_created desc' = $1 then \"date_created\" end desc limit $2 offset $3", sortAndDirection, size, from, text)


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

	rows, err = db.DB.Query("SELECT count(*) as \"total\" from todo where ('' = $1 or content ilike '%' || $1 || '%')", text)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Could not get todos"})
		panic(err)
	}
	var total int64
	for rows.Next() {
		if err = rows.Scan(&total); err != nil {
			// return relevant error
			panic(err)
		}
	}

	result, err:= todo_pagination_result.New(todos, total)
	if err != nil {
		// return relevant error
		panic(err)
	}
	

	c.IndentedJSON(http.StatusOK, result)
}

func createTodo(c *gin.Context) {
	var requestBody TodoRequestBody
   if err := c.BindJSON(&requestBody); err != nil {
		// return bad request
		panic(err)
   }
	newTodo, err:= todo.New(requestBody.Content)
	if err != nil {
		// return relevant error
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Could not create todo"})
	}
	// return created object
	c.IndentedJSON(http.StatusCreated, newTodo)
}
