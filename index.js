/*replace each '-' as needed*/

const { Telegraf } = require('telegraf');
const mysql = require('mysql');
const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const bot = new Telegraf('-');

const db = mysql.createConnection({
  host: '-',
  user: '-',
  password: '-',
  database: '-'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected');
});

function createBackup(database, user, ctx) {
  const date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let currentDate = (date + "_" + month + "_" + year + "_" + hours + "_" + minutes + "_" + seconds);
  let file = path.join(__dirname, 'backups', `${database}-${currentDate}.sql`);
  let filename = `${database}-${currentDate}.sql`;

  // Perform the mysqldump to create a backup
  mysqldump({
    connection: {
      host: '-', // Replace with your DB host if different
      user: '-', // Replace with your DB username
      password: '-', // Replace with your DB password
      database: '-' // The name of the database to backup
    },
    dumpToFile: file,
    compressFile: false
  })
  .then(() => {
    // Wait a moment before sending the file (optional)
    setTimeout(() => {
      // Send the backup file to the user via Telegram bot
      ctx.telegram.sendDocument(user, { source: file }, { caption: `Backup of database ${database}` })
        .then(() => {
          // Delete the backup file after sending
          fs.unlinkSync(file);
        })
        .catch(err => {
          console.error('Error sending backup file:', err);
          ctx.reply('Failed to send the backup file.');
        });
    }, 1500); // Optional delay to ensure backup is complete before sending
  })
  .catch(err => {
    console.error('Error creating backup:', err);
    ctx.reply('Failed to create the backup.');
  });
}

bot.start((ctx) => {
  ctx.reply(`
Welcome to the MySQL Bot! Available commands:

- Table Commands:
  /create_table <table_name> (column1 TYPE, column2 TYPE, ...)
  /drop_table <table_name>
  
- Column Commands:
  /add_column <table_name> <column_name> <column_type>
  /drop_column <table_name> <column_name>
  /rename_column <table_name> <old_column_name> <new_column_name>
  /change_column_type <table_name> <column_name> <new_type>

- Data Commands:
  /create_data <table_name> <column1,column2>
  /read_data <table_name>
  /update_data <table_name> <id> <column1,column2>
  /delete_data <table_name> <id>

- View Commands:
  /create_view <view_name> AS SELECT <columns> FROM <table_name> WHERE <condition>
  /drop_view <view_name>

- Stored Procedure Commands:
  /create_procedure <procedure_name> (params) BEGIN <SQL_commands> END
  /call_procedure <procedure_name>(params)
  /drop_procedure <procedure_name>

- Backup Command:
  /backup
`);
});

bot.command('create_table', (ctx) => {
  const tableName = ctx.message.text.split(' ')[1];
  if (!tableName) return ctx.reply('Provide table name in format: /create_table <table_name>');
  
  const query = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY)`;
  
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply(`Table ${tableName} successfully created with a default 'id' column!`);
  });
});

bot.command('drop_table', (ctx) => {
  const tableName = ctx.message.text.split(' ')[1];
  if (!tableName) return ctx.reply('Provide table name in format: /drop_table <table_name>');
  const query = `DROP TABLE ${tableName}`;
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply(`Table ${tableName} deleted!`);
  });
});

bot.command('add_column', (ctx) => {
  const [tableName, columnName, columnType] = ctx.message.text.split(' ').slice(1);
  if (!tableName || !columnName || !columnType) return ctx.reply('Provide values in format: /add_column <table_name> <column_name> <column_type>');

  const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
  
  db.query(query, (err) => {
    if (err) return ctx.reply(`Error: ${err.message}`);
    ctx.reply(`Column ${columnName} of type ${columnType} added to table ${tableName}`);
  });
});

bot.command('drop_column', (ctx) => {
  const [tableName, columnName] = ctx.message.text.split(' ').slice(1);
  if (!tableName || !columnName) return ctx.reply('Provide values in format: /drop_column <table_name> <column_name>');

  const query = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
  
  db.query(query, (err) => {
    if (err) return ctx.reply(`Error: ${err.message}`);
    ctx.reply(`Column ${columnName} dropped from table ${tableName}`);
  });
});

bot.command('rename_column', (ctx) => {
  const [tableName, oldColumnName, newColumnName] = ctx.message.text.split(' ').slice(1);
  if (!tableName || !oldColumnName || !newColumnName) return ctx.reply('Provide values in format: /rename_column <table_name> <old_column_name> <new_column_name>');

  const query = `ALTER TABLE ${tableName} CHANGE ${oldColumnName} ${newColumnName} VARCHAR(255)`; // Default to VARCHAR(255)
  
  db.query(query, (err) => {
    if (err) return ctx.reply(`Error: ${err.message}`);
    ctx.reply(`Column ${oldColumnName} renamed to ${newColumnName} in table ${tableName}`);
  });
});

bot.command('change_column_type', (ctx) => {
  const [tableName, columnName, newType] = ctx.message.text.split(' ').slice(1);
  if (!tableName || !columnName || !newType) return ctx.reply('Provide values in format: /change_column_type <table_name> <column_name> <new_type>');

  const query = `ALTER TABLE ${tableName} MODIFY COLUMN ${columnName} ${newType}`;
  
  db.query(query, (err) => {
    if (err) return ctx.reply(`Error: ${err.message}`);
    ctx.reply(`Column ${columnName} type changed to ${newType} in table ${tableName}`);
  });
});

bot.command('create_data', (ctx) => {
  const [tableName, ...data] = ctx.message.text.split(' ').slice(1).join(' ').split(' ');
  const values = data.join(' ').split(',');
  if (!tableName || values.length === 0) return ctx.reply('Provide data in format: /create_data <table_name> <column1,column2>');
  const placeholders = values.map(() => '?').join(',');
  const query = `INSERT INTO ${tableName} VALUES (${placeholders})`;
  db.query(query, values, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply('Data inserted!');
  });
});

bot.command('read_data', (ctx) => {
  const tableName = ctx.message.text.split(' ')[1];
  if (!tableName) return ctx.reply('Provide table name in format: /read_data <table_name>');
  const query = `SELECT * FROM ${tableName}`;
  db.query(query, (err, results) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else {
      const messages = results.map(row => JSON.stringify(row)).join('\n');
      ctx.reply(messages || 'No data found');
    }
  });
});

bot.command('update_data', (ctx) => {
  const [tableName, id, ...data] = ctx.message.text.split(' ').slice(1).join(' ').split(' ');
  const values = data.join(' ').split(',');
  if (!tableName || !id || values.length === 0) return ctx.reply('Provide values in format: /update_data <table_name> <id> <column1,column2>');
  const updates = values.map((value, index) => `column${index + 1} = ?`).join(', ');
  const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
  db.query(query, [...values, id], (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply('Data updated!');
  });
});

bot.command('delete_data', (ctx) => {
  const [tableName, id] = ctx.message.text.split(' ').slice(1);
  if (!tableName || !id) return ctx.reply('Provide values in format: /delete_data <table_name> <id>');
  const query = `DELETE FROM ${tableName} WHERE id = ?`;
  db.query(query, [id], (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply('Data deleted!');
  });
});

bot.command('create_view', (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ');
  if (!input) return ctx.reply('Provide view schema in format: /create_view <view_name> AS SELECT <columns> FROM <table_name> WHERE <condition>');
  const query = `CREATE VIEW ${input}`;
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply('View created!');
  });
});

bot.command('drop_view', (ctx) => {
  const viewName = ctx.message.text.split(' ')[1];
  if (!viewName) return ctx.reply('Provide view name in format: /drop_view <view_name>');
  const query = `DROP VIEW ${viewName}`;
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply(`View ${viewName} deleted!`);
  });
});

bot.command('create_procedure', (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ');
  if (!input) return ctx.reply('Provide procedure schema in format: /create_procedure <procedure_name> (params) BEGIN <SQL_commands> END');
  const query = `CREATE PROCEDURE ${input}`;
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply('Procedure created!');
  });
});

bot.command('call_procedure', (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ');
  if (!input) return ctx.reply('Provide procedure call in format: /call_procedure <procedure_name>(params)');
  const query = `CALL ${input}`;
  db.query(query, (err, results) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else {
      const messages = results.map(row => JSON.stringify(row)).join('\n');
      ctx.reply(messages || 'No result');
    }
  });
});

bot.command('drop_procedure', (ctx) => {
  const procedureName = ctx.message.text.split(' ')[1];
  if (!procedureName) return ctx.reply('Provide procedure name in format: /drop_procedure <procedure_name>');
  const query = `DROP PROCEDURE ${procedureName}`;
  db.query(query, (err) => {
    if (err) ctx.reply(`Error: ${err.message}`);
    else ctx.reply(`Procedure ${procedureName} deleted!`);
  });
});

// Command to trigger database backup
bot.command('backup', (ctx) => {
  const userId = ctx.from.id;
  const databaseName = '-'; // Specify your database name here
  createBackup(databaseName, userId, ctx);
});

bot.launch();