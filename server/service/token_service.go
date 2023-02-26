package service

import (
	"context"
	"isharescreen/server/model"
	"isharescreen/server/model/apperrors"
	"log"
)

type TokenService struct {
	RefreshSecret string
}

type TSConfig struct {
	RefreshSecret string
}

func NewTokenService(c *TSConfig) model.TokenService {
	return &TokenService{
		RefreshSecret: c.RefreshSecret,
	}
}

func (s *TokenService) NewPairFromUser(ctx context.Context, u *model.User, prevTokenID string) (*model.TokenPair, error) {

	idToken, err := generateIDToken(u)

	if err != nil {
		log.Printf("Error generating idToken for uid: %v. Error: %v\n", u.UID, err.Error())
		return nil, apperrors.NewInternal()
	}

	refreshToken, err := generateRefreshToken(u.UID, s.RefreshSecret)

	if err != nil {
		log.Printf("Error generating refreshToken for uid: %v. Error: %v\n", u.UID, err.Error())
		return nil, apperrors.NewInternal()
	}

	return &model.TokenPair{
		IDToken:      idToken,
		RefreshToken: refreshToken.SS,
	}, nil
}
