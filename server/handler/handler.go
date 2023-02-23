package handler

import (
	"isharescreen/server/model"
	"os"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	UserService model.UserService
}

type Config struct {
	R           *gin.Engine
	UserService model.UserService
}

func NewHandler(c *Config) {
	h := &Handler{
		UserService: c.UserService,
	}

	g := c.R.Group(os.Getenv("ACCOUNT_API_URL"))

	g.GET("/me", h.Me)
}
