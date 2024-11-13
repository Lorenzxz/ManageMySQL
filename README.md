# MySQL Management Bot for Telegram

A Telegram bot that allows users to manage a MySQL database directly from Telegram. Users can create, read, update, and delete tables, columns, and data, as well as create database backups and manage views and stored procedures.

## Table of Contents

1. [Table Commands](#table-commands)
2. [Column Commands](#column-commands)
3. [Data Commands](#data-commands)
4. [View Commands](#view-commands)
5. [Stored Procedure Commands](#stored-procedure-commands)
6. [Backup Command](#backup-command)

## Table Commands

### `/create_table <table_name> (column1 TYPE, column2 TYPE, ...)`

- **Description**: Creates a new table in the database with the specified columns and their data types.
- **Usage**: `/create_table <table_name> (column1 TYPE, column2 TYPE, ...)`
- **Example**:  
  `/create_table users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100))`  
  Creates a table named `users` with columns: `id`, `name`, and `email`.

### `/drop_table <table_name>`

- **Description**: Drops (deletes) an existing table from the database.
- **Usage**: `/drop_table <table_name>`
- **Example**:  
  `/drop_table users`  
  Deletes the `users` table from the database.

---

## Column Commands

### `/add_column <table_name> <column_name> <column_type>`

- **Description**: Adds a new column to an existing table.
- **Usage**: `/add_column <table_name> <column_name> <column_type>`
- **Example**:  
  `/add_column users age INT`  
  Adds a column `age` of type `INT` to the `users` table.

### `/drop_column <table_name> <column_name>`

- **Description**: Drops (deletes) a column from an existing table.
- **Usage**: `/drop_column <table_name> <column_name>`
- **Example**:  
  `/drop_column users age`  
  Deletes the `age` column from the `users` table.

### `/rename_column <table_name> <old_column_name> <new_column_name>`

- **Description**: Renames a column in an existing table.
- **Usage**: `/rename_column <table_name> <old_column_name> <new_column_name>`
- **Example**:  
  `/rename_column users name full_name`  
  Renames the `name` column to `full_name` in the `users` table.

### `/change_column_type <table_name> <column_name> <new_type>`

- **Description**: Changes the data type of an existing column.
- **Usage**: `/change_column_type <table_name> <column_name> <new_type>`
- **Example**:  
  `/change_column_type users age VARCHAR(10)`  
  Changes the `age` column type to `VARCHAR(10)` in the `users` table.

---

## Data Commands

### `/create_data <table_name> <column1,column2,...>`

- **Description**: Inserts data into a specified table. The values for the columns must be provided in the correct order.
- **Usage**: `/create_data <table_name> <column1,column2,...>`
- **Example**:  
  `/create_data users "John Doe, johndoe@example.com, 30"`  
  Inserts a new row with `name` as "John Doe", `email` as "johndoe@example.com", and `age` as `30` into the `users` table.

### `/read_data <table_name>`

- **Description**: Reads and displays all data from a specified table.
- **Usage**: `/read_data <table_name>`
- **Example**:  
  `/read_data users`  
  Displays all rows from the `users` table.

### `/update_data <table_name> <id> <column1,column2,...>`

- **Description**: Updates data in a specified table for a given ID. The columns to be updated are provided with their new values.
- **Usage**: `/update_data <table_name> <id> <column1,column2,...>`
- **Example**:  
  `/update_data users 1 "John Smith, johnsmith@example.com, 35"`  
  Updates the `users` table where `id = 1` with new `name`, `email`, and `age`.

### `/delete_data <table_name> <id>`

- **Description**: Deletes data from a specified table by ID.
- **Usage**: `/delete_data <table_name> <id>`
- **Example**:  
  `/delete_data users 1`  
  Deletes the row from the `users` table where `id = 1`.

---

## View Commands

### `/create_view <view_name> AS SELECT <columns> FROM <table_name> WHERE <condition>`

- **Description**: Creates a view based on a SELECT query.
- **Usage**: `/create_view <view_name> AS SELECT <columns> FROM <table_name> WHERE <condition>`
- **Example**:  
  `/create_view active_users AS SELECT id, name, email FROM users WHERE status = 'active'`  
  Creates a view named `active_users` that selects `id`, `name`, and `email` from the `users` table where `status` is `active`.

### `/drop_view <view_name>`

- **Description**: Drops (deletes) an existing view.
- **Usage**: `/drop_view <view_name>`
- **Example**:  
  `/drop_view active_users`  
  Deletes the `active_users` view from the database.

---

## Stored Procedure Commands

### `/create_procedure <procedure_name> (params) BEGIN <SQL_commands> END`

- **Description**: Creates a stored procedure with the specified SQL commands.
- **Usage**: `/create_procedure <procedure_name> (params) BEGIN <SQL_commands> END`
- **Example**:  
  `/create_procedure update_user_email (user_id INT, new_email VARCHAR(100)) BEGIN UPDATE users SET email = new_email WHERE id = user_id END`  
  Creates a stored procedure named `update_user_email` that updates the email of a user by their `user_id`.

### `/call_procedure <procedure_name>(params)`

- **Description**: Calls a stored procedure with the specified parameters.
- **Usage**: `/call_procedure <procedure_name>(params)`
- **Example**:  
  `/call_procedure update_user_email(1, 'newemail@example.com')`  
  Calls the `update_user_email` stored procedure with `user_id = 1` and `new_email = 'newemail@example.com'`.

### `/drop_procedure <procedure_name>`

- **Description**: Drops (deletes) an existing stored procedure.
- **Usage**: `/drop_procedure <procedure_name>`
- **Example**:  
  `/drop_procedure update_user_email`  
  Deletes the `update_user_email` stored procedure from the database.

---

## Backup Command

### `/backup`

- **Description**: Creates a backup of the database and sends it as a document to the user via Telegram.
- **Usage**: `/backup`
- **Example**:  
  `/backup`  
  Creates a backup of the database and sends it to the user.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lorenzxz/ManageMySQL.git
   cd ManageMySQL
