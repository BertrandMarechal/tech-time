package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
	"go-backend/db"
)

func main() {
	err := db.OpenDatabase()
	if err != nil {
		panic(err)
	}
	defer db.CloseDatabase()

	router := gin.Default()
	router.GET("/api/todos", getTodos)
	router.DELETE("/api/todos", deleteTodos)
	router.POST("/api/todos", createTodo)
	router.DELETE("/api/todos/:todoId", deleteTodo)
	router.PUT("/api/todos/:todoId", updateTodo)
	router.PUT("/api/todos/:todoId/order", updateTodoOrder)

	var port = os.Getenv("PORT")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:20700"},
	}))
	router.Run(fmt.Sprintf("0.0.0.0:%s", port))
}
