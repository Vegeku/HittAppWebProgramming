CREATE TABLE Workout (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(30)     NOT NULL,
    difficulty TEXT NOT NULL,
    duration INT NOT NULL,
    exercises TEXT NOT NULL 
    --the exercises are going to be store as JSON
); 

-- INSERT INTO Workout VALUES {
--     1,
--     "default exercises",
--     'Easy',
--     0,
--     `{"exercises": []}`
-- }

-- DROP TABLE Workout;

