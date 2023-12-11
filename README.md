# test_task

##How to run the project

First, clone this repository to a folder on your local machine and move to inside the test_task folder

```
npm install

npm run dev
```

## setup environment for locally

The project will be using PostgreSQL as a database and need to create a database locally. choose preferred name for database.

Replace the database name and password inside `/config/index.js` file

Email used for sending notifications is a test email created for this project

set environment on local. create `.env` file inside the root folder. 

### set the environment variable values

```
STRIPE_SECRET_KEY="sk_test_51OM0G7GRyHi2kd9oDov7gnCAj0djwBiAw2qfYCeIXpujpyKq78BqgUxNi3SvwxVrKLiPUPZj54OzL624DFsDwByD009X0mldgF"
PORT=3000
STRIPE_PRODUCT_ONE_PRICE_ID=price_1OM0qIGRyHi2kd9oFlTEtqlo
```


## Postman Collection

Need to create environment for development

![postman create environment variable](https://github.com/Mintaa911/test_task/assets/61611671/c2817228-7b26-48ea-973e-08dc63c95aa8)

