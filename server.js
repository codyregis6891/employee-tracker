const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();
const consoleTable = require('console.table');

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
            // employeesMenu();
            break;
          
          case "Roles":
            // rolesMenu();
            break;
  
          case "End Session":
            console.log('Goodbye!')
            connection.end();
            break;
      };
    });
  };

  const departmentsMenu = () => {
    inquirer.prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'deptInit',
            choices: ['View Departments', 'Add Department', 'Back to Main Menu']
        }
    ])
    .then(response => {
        switch (response.deptInit) {
            case 'View Departments':
                viewDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Back to Main Menu':
                mainMenu();
                break;
        };
    });
};

const viewDepartments = () => {
    connection.query('SELECT * FROM employee_db.department', (err, res) => {
        if (err) throw err;
        console.log('\n-----------------------------------');
        console.table(res);
        console.log('Press arrow key to bring down menu!\n-----------------------------------\n');
    });
    departmentsMenu();
};

const addDepartment = () => {
    inquirer
    .prompt([
      {
        name: "add",
        type: "input",
        message: "Please enter a department name.",
      },
    ])
    .then(response => {
      connection.query(
        "INSERT INTO employee_db.department SET ?",
        {
          name: response.add,
        },
        function (err) {
          if (err) throw err;
          console.log(`You have created a department: \n'${response.add}'.`)
          departmentsMenu();
        }
      );
    });
};
