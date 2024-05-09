CREATE TABLE Workout(
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    difficulty TEXT NOT NULL,
    duration INT NOT NULL,
    exercises TEXT NOT NULL 
    --the exercises are going to be store as JSON
); 

-- DROP TABLE Workout;

