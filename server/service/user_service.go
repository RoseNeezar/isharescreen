package service

import (
	"context"
	"isharescreen/server/model"
	"isharescreen/server/model/apperrors"
	"log"

	"github.com/google/uuid"
)

type UserService struct {
	UserRepository model.UserRepository
}

type USConfig struct {
	UserRepository model.UserRepository
}

func NewUserService(c *USConfig) model.UserService {
	return &UserService{
		UserRepository: c.UserRepository,
	}
}

func (s *UserService) Get(ctx context.Context, uid uuid.UUID) (*model.User, error) {
	u, err := s.UserRepository.FindByID(ctx, uid)
	return u, err
}

func (s *UserService) Signup(ctx context.Context, u *model.User) error {
	pw, err := hashPassword(u.Password)
	if err != nil {
		log.Printf("Unable to signup user for email: %v\n", u.Email)
		return apperrors.NewInternal()
	}

	// now I realize why I originally used Signup(ctx, email, password)
	// then created a user. It's somewhat un-natural to mutate the user here
	u.Password = pw

	if err := s.UserRepository.Create(ctx, u); err != nil {
		return err
	}

	// If we get around to adding events, we'd Publish it here
	// err := s.EventsBroker.PublishUserUpdated(u, true)

	// if err != nil {
	// 	return nil, apperrors.NewInternal()
	// }

	return nil
}
