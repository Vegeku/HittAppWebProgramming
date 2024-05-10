import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: './database' });
  return db;
}

const dbConn = init();


export async function listWorkout() {
  const db = await dbConn;
  return db.all('SELECT * FROM Workout ORDER BY duration DESC');
}

export async function findWorkout(id) {
  const db = await dbConn;
  return db.get('SELECT * FROM Workout WHERE id = ?', id);
}

export async function deleteWorkout(id) {
  const db = await dbConn;
  return db.run('DELETE FROM Workout WHERE id = ?', id);
}

export async function addWorkout(name, diff, duration, exercises) {
  if (name.trim() === '' && exercises.length === 0) return listWorkout();
  const db = await dbConn;
  const id = uuid();
  const n = name;
  const d = parseInt(duration);
  const listOfExercises = JSON.stringify({ exercises });
  await db.run('INSERT INTO Workout VALUES (?, ?, ?, ?, ?)', [id, n, diff, d, listOfExercises]);
  return listWorkout();
}

export async function editWorkout(id, updatedWorkout) {
  const db = await dbConn;
  const name = updatedWorkout.name;
  const duration = updatedWorkout.duration;
  const diff = updatedWorkout.difficulty;
  const exercises = updatedWorkout.exercises;
  const listOfExercises = JSON.stringify({ exercises });
  const statement = await db.run('UPDATE Workout SET name = ?, difficulty = ?, duration = ?, exercises = ? WHERE id = ?', [name, diff, duration, listOfExercises, id]);

  if (statement.changes === 0) throw new Error('Workout not found');
  return findWorkout(id);
}
