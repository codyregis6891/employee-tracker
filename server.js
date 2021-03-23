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
        choices: ["Departments", "Roles", "Employees", "End Session"]
        }
    ])
    .then(response => {
      switch (response.init) {
        case "Departments":
          departmentsMenu();
          break;

          case "Roles":
            rolesMenu();
            break;
  
          case "Employees":
            // employeesMenu();
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
        message: "Please enter a department name."
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

const rolesMenu = () => {
    inquirer.prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'rolesInit',
            choices: ['View Roles', 'Add Role', 'Back to Main Menu']
        }
    ])
    .then(response => {
        switch (response.rolesInit) {
            case 'View Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Back to Main Menu':
                mainMenu();
                break;
        };
    });
};

const viewRoles = () => {
    connection.query('SELECT role.id, role.title, role.salary, department.name as "Department Name" FROM employee_db.role INNER JOIN employee_db.department ON role.department_id = department.id', (err, res) => {
        if (err) throw err;
        console.log('\n-----------------------------------');
        console.table(res);
        console.log('Press arrow key to bring down menu!\n-----------------------------------\n');
    });
    departmentsMenu();
};

let departmentId = [];
let departmentName = [];

const deptList = async () => {
    const departmentList = connection.query('SELECT * FROM employee_db.department', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, name }) => {
            departmentId.push(id);
            departmentName.push(`-- ${name} : ${id} --`);
        })
    });
};

deptList();

const addRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: 'Please enter a name for this role.',
            name: 'title'
        },
        {
            type: 'number',
            message: 'Enter Salary',
            name: 'salary'
        },
        {
            type: 'list',
            message: `Choose the ID number of the department this role will be in: \n${departmentName} `,
            name: 'department',
            choices: departmentId
        }
    ])
    .then(response => {
    connection.query('INSERT INTO employee_db.role SET ?', 
        {
            title: `${response.title}`,
            salary: `${response.salary}`,
            department_id: `${response.department}`
        },
        (err, res) => {
        if (err) throw err;
        console.log(`You have created a new role: \n${response.title}`);
        rolesMenu();
        });
    });

};