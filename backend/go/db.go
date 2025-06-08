package main

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	_ "github.com/lib/pq"
)

var DB *sql.DB


func OpenDatabase() error {
	var host = os.Getenv("DB_HOST")
	var password = os.Getenv("DB_PASSWORD")
	var user = os.Getenv("DB_USER")
	var dbname = os.Getenv("DB_NAME")
	var dbport, err = strconv.ParseUint(os.Getenv("DB_PORT"), 10, 64)

	if err != nil {
		fmt.Println("Could not parse port %s", os.Getenv("DB_PORT"))
		panic(err)
	}
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, dbport, user, password, dbname)

	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = DB.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Succesfully connected")

	return nil
}
func CloseDatabase() {
	DB.Close()
}
