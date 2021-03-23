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
            employeesMenu();
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
        console.table(res);
        departmentsMenu();
    });
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
        console.table(res);
        rolesMenu();
    });
};

let departmentId = [];
let departmentName = [];

const deptList = async () => {
    const departmentList = connection.query('SELECT * FROM employee_db.department', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, name }) => {
            departmentId.push(id);
            departmentName.push(` ${name} : ${id} `);
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

const employeesMenu = () => {
    inquirer.prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'employeesInit',
            choices: ['View Employees', 'Add Employee', 'Update Employee Roles', 'Back to Main Menu']
        }
    ])
    .then(response => {
        switch (response.employeesInit) {
            case 'View Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Roles':
                updateEmployees();
                break;
            case 'Back to Main Menu':
                mainMenu();
                break;
        };
    });
};

const viewEmployees = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title as "Title" FROM employee_db.employee INNER JOIN employee_db.role ON employee.role_id = role.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        employeesMenu();
    });
};

let roleId = [];
let roleList = [];

const roleDisplay = async () => {
    const roleName = connection.query('SELECT * FROM employee_db.role', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, title }) => {
            roleId.push(id)
            roleList.push(` ${title}: ${id} `)
        });
    });
};

roleDisplay();

const addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: "Enter employee's first name",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "Enter employee's last name",
            name: 'lastName'
        },
        {
            type: 'list',
            message: `Choose the ID number of the role this employee will have: \n${roleList} `,
            name: 'role',
            choices: roleId
        }
    ])
    .then(response => {
        connection.query('INSERT INTO employee_db.employee SET ?', 
            {
                first_name: `${response.firstName}`,
                last_name: `${response.lastName}`,
                role_id: `${response.role}`
            },
            (err, res) => {
            if (err) throw err;
            console.log(`You have created a new employee: \n${response.firstName} ${response.lastName}`);
            employeesMenu();
            });
        });
};

let empName = [];
let empId = [];

const empNames = async () => {
    const namesList = connection.query('SELECT id, first_name, last_name FROM employee_db.employee', (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name }) => {
            empId.push(id);
            empName.push(` ${first_name} ${last_name}: ${id} `);
        });
    });
};

empNames();

const updateEmployees = () => {
    inquirer.prompt ([
        {
            type: 'list',
            message: `Choose the ID of the employee you would like to update: \n${empName} `,
            name: 'names',
            choices: empId
        },
        {
            type: 'list',
            message: `Choose the ID of the new role you would like the employee to have: \n${roleList}`,
            name: 'roles',
            choices: roleId
        }
    ])
    .then(response => {
    const query = connection.query(
        `UPDATE employee_db.employee SET ? WHERE ?`,
        [
        {
            role_id: `${response.roles}`,
        },
        {
            id: `${response.names}`
        }
        ],
        (err, res) => {
        if (err) throw err;
        console.log(`You have successfully edited this employee!`);
        employeesMenu();
        });
    });
};
