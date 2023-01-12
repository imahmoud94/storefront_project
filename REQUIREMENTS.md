# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index /products [GET]
- Show /products/:id [GET]
- Create [token required] /products [POST]

#### Users

- Index /users [GET]
- Show /users/:id [GET]
- Delete [bearer token required] /users [DELETE]
- Update [bearer token required] /users [PATCH] body: {id, user_name, first_name, last_name, password}
- Create /users [POST] body: {user_name, first_name, last_name, password}
- Authenticate /users/auth [POST] body: { user_name, password }

#### Orders

- Orders by user (args: user id)[token required] /orders

## Data Shapes

#### Products

- id
- name
- price

#### Users

- id
- user_name
- first_name
- last_name
- password

#### Orders

- id
- user_id
- completed (true or false)

#### Order products

- id
- product_id
- order_id
- quantity of product

## Data Schema

#### Products

|    Products Table                                                                                     |
|   Column   |          Type             | Collation | Nullable |              Default                  |
|------------|---------------------------|-----------|----------|-----------------------------------    |
| id            | integer                |           | not null | nextval('products_id_seq'::regclass)  |
| product_name  | character varying(100) |           | not null |                                       |
| price         | numeric                |           | not null |                                       |


#### Users

|    Users Table                                                                                 |
|   Column   |          Type          | Collation | Nullable |              Default              |
|------------|------------------------|-----------|----------|-----------------------------------|
| id         | integer                |           | not null | nextval('users_id_seq'::regclass) |
| user_name  | character varying(100) |           | not null |                                   |
| first_name | character varying(100) |           | not null |                                   |
| last_name  | character varying(100) |           | not null |                                   |
| password   | character varying(255) |           | not null |                                   |

#### Orders

|    Orders Table                                                                          |
|   Column   |     Type      | Collation| Nullable |              Default                  |
|------------|---------------|----------|----------|-----------------------------------    |
| id         | integer       |          | not null | nextval('orders_id_seq'::regclass)    |
| user_id    | integer       |          | not null |                                       |
| completed  | boolean       |          | not null |                                       |

#### Order_Products


|    Order Products Table                                                                      |
|   Column   |  Type       | Collation | Nullable |              Default                       |
|------------|-------------|-----------|----------|--------------------------------------------|
| id         | integer     |           | not null | nextval('order_products_id_seq'::regclass) |
| product_id | integer     |           | not null |                                            |
| order_id   | integer     |           | not null |                                            |
| quantity   | integer     |           | not null |                                            |