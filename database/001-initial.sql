CREATE TABLE Workout (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(30)     NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL,
    exercises TEXT NOT NULL 
    --the exercises are going to be store as JSON
); 

