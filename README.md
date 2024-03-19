# Exercise Tracker

Project 4 of Back End Development through FreeCodeCamp curriculum

## Function

- Exercise tracker with user creation and log generation
- New users stored in a MongoDB under exercise-tracker.users
- New exercises stored in a MongoDB under exercise-tracker.exercises 

## How to use 

### Submit a user

- Via Create a New User form, providing a username 
- `POST /api/users/`

### Add exercises

- Via Add exercises form, user provides their id, description of the exercise, duration of the exercise and, optionally, a date
- A blank date defaults to the current date
- `POST /api/users/:_id/exercises`

### User logs

- Retrieve user logs via `GET /api/users/:_id/logs?[from][&to][&limit]`
- [] = optional
- from, to = dates (yyy-mm-dd)
- limit = number

## Learning

