# Express Starter

This starter repo will be used for building applications using React, Material-UI, React-Router, Node, & Express.js.

## Getting started

The project is broken down into a client and server folder.

## Connecting to MongoDB Locally

In the `.env` file create the following two variables and assign them the mongoURI and database password like so:<br>

    DATABASE=<mongoURI_goes_here>
    DATABASE_PASSWORD=<db_password_goes_here>

You should now be able to connect to the mongoDB database.

## In the `.env` file create the TOKEN_SECRET variable

TOKEN_SECRET=<token_secret>

Finished Backend Login / Register API routes

## Login route : '/api/login/'

    Verifies email and password. Returns 400 if things are incorrect.
    Creates and assigns token using **jsonwebstoken** and **httpOnly cookie**

## Register route: '/api/register'

    Creates new User and validates required fields
