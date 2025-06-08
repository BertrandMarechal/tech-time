package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
	err := OpenDatabase()
	if err != nil {
		panic(err)
	}
	defer CloseDatabase()

	router := gin.Default()
	router.GET("/api/todos", getTodos)

	var port = os.Getenv("PORT")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:20700"},
	}))
	router.Run(fmt.Sprintf("0.0.0.0:%s", port))
}
