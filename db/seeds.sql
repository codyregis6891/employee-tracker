INSERT INTO department (name)
VALUES ('Coaching Staff'),
       ('Training Staff'),
       ('Athletics'),
       ('Nutrition'),
       ('Media'),
       ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ('Head Coach', 1000000, 1),
       ('Hitting Coach', 500000, 1),
       ('Pitching Coach', 500000, 1),
       ('Strength Coordinator', 100000, 2),
       ('Conditioning Coordinator', 100000, 2),
       ('Team Physician', 250000, 2),
       ('Pitcher', 10000000, 3),
       ('Infielder', 5000000, 3),
       ('Outfielder', 15000000, 3),
       ('Dietician', 50000, 4),
       ('Chef', 75000, 4),
       ('Play-by-Play Commentator', 200000, 5),
       ('PA Announcer', 45000, 5),
       ('Ticket Sales', 35000, 6),
       ('Usher', 35000, 6),
       ('Marketing', 115000, 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Colin', 'Bray', 9),
        ('Grant', 'Heyman', 8),
        ('John', 'Savage', 1),
        ('Rick', 'Vanderhook', 2),
        ('Johnny', 'Tooze', 3),
        ('Chad', 'Swole', 4),
        ('Pete', 'Wheeler', 5),
        ('Dr.', 'Sachin', 6),
        ('Ethan', 'Elias', 7),
        ('Alex', 'Guerrero', 10),
        ('Gordon', 'Ramsay', 11),
        ('Joe', 'Buck', 12),
        ('Karl', 'Ravich', 13),
        ('Pablo', 'Sanchez', 14),
        ('Dan', 'Henley', 15),
        ('Shawn', 'Regis', 16);
        