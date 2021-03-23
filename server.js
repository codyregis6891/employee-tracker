const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();
const consoleTable = require('console.table');
const departmentsMenu = require('./assets/departmentsMenu');
// const rolesMenu = require('./assets/roles');
// const employeesMenu = require('./assets/employees');

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    mainMenu();
  });

const mainMenu = () => {

    inquirer
    .prompt([
        {
        name:"init",
        type:"list",
        message:"Where would you like to go?",
        choices: ["Departments", "Employees", "Roles", "End Session"]
        }
    ])
    .then(response => {
      switch (response.init) {
        case "Departments":
          departmentsMenu();
          break;
  
          case "Employees":
            employeesMenu();
            break;
          
          case "Roles":
            rolesMenu();
            break;
  
          case "End Session":
            console.log('Goodbye!')
            connection.end();
            break;
      };
    });
  };

  module.exports = server;