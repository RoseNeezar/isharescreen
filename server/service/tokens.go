package service

import (
	"fmt"
	"isharescreen/server/model"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

type idTokenCustomClaims struct {
	User *model.User `json:"user"`
	jwt.StandardClaims
}

type refreshTokenData struct {
	SS        string
	ID        uuid.UUID
	ExpiresIn time.Duration
}

type refreshTokenCustomClaims struct {
	UID uuid.UUID `json:"uid"`
	jwt.StandardClaims
}

func generateIDToken(u *model.User) (string, error) {
	unixTime := time.Now().Unix()
	tokenExp := unixTime + 60*15 // 15 minutes from current time

	claims := idTokenCustomClaims{
		User: u,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  unixTime,
			ExpiresAt: tokenExp,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	ss, err := token.SignedString([]byte(os.Getenv("jwt_secret")))

	if err != nil {
		log.Println("Failed to sign id token string")
		return "", err
	}

	return ss, nil
}

type RefreshToken struct {
	SS        string
	ID        string
	ExpiresIn time.Duration
}

type RefreshTokenCustomClaims struct {
	UID uuid.UUID `json:"uid"`
	jwt.StandardClaims
}

func generateRefreshToken(uid uuid.UUID, key string) (*RefreshToken, error) {
	currentTime := time.Now()
	tokenExp := currentTime.AddDate(0, 0, 3) // 3 days
	tokenID, err := uuid.NewRandom()         // v4 uuid in the google uuid lib

	if err != nil {
		log.Println("Failed to generate refresh token ID")
		return nil, err
	}

	claims := RefreshTokenCustomClaims{
		UID: uid,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  currentTime.Unix(),
			ExpiresAt: tokenExp.Unix(),
			Id:        tokenID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(key))

	if err != nil {
		log.Println("Failed to sign refresh token string")
		return nil, err
	}

	return &RefreshToken{
		SS:        ss,
		ID:        tokenID.String(),
		ExpiresIn: tokenExp.Sub(currentTime),
	}, nil
}

func validateIDToken(tokenString string) (*idTokenCustomClaims, error) {
	claims := &idTokenCustomClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("jwt_secret")), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("ID token is invalid")
	}

	claims, ok := token.Claims.(*idTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("ID token valid but couldn't parse claims")
	}

	return claims, nil
}

func validateRefreshToken(tokenString string, key string) (*refreshTokenCustomClaims, error) {
	claims := &refreshTokenCustomClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("Refresh token is invalid")
	}

	claims, ok := token.Claims.(*refreshTokenCustomClaims)

	if !ok {
		return nil, fmt.Errorf("Refresh token valid but couldn't parse claims")
	}

	return claims, nil
}
