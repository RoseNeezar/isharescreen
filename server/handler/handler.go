package handler

import (
	"isharescreen/server/model"
	"os"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	UserService  model.UserService
	TokenService model.TokenService
}

type Config struct {
	R            *gin.Engine
	UserService  model.UserService
	TokenService model.TokenService
}

func NewHandler(c *Config) {
	h := &Handler{
		UserService:  c.UserService,
		TokenService: c.TokenService,
	}

	g := c.R.Group(os.Getenv("ACCOUNT_API_URL"))

	g.GET("/me", h.Me)
	g.POST("/signup", h.Signup)
}
