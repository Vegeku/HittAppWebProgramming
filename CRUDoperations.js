import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true
  });
  await db.migrate({ migrationsPath: './database' });
  return db;
}

const dbConn = init();

export async function listWorkout() {
  const db = await dbConn;
  return db.all('SELECT * FROM Workout ORDER BY level DESC');
}

export async function findWorkout(id) {
  const db = await dbConn;
  return db.get('SELECT * FROM Workout WHERE id = ?', id);
}

export async function deleteWorkout(id) {
  const db = await dbConn;
  return db.run('DELETE FROM Workout WHERE id = ?', id);
}

export async function addWorkout(name,level,duration,exercises) {
  if (name.trim() === '' && level.trim() === '' && exercises == []) return listWorkout();
  const db = await dbConn;
  const id = uuid();
  const n = name;
  const d = parseInt(duration);
  const listofExercises = `{"exercises": [${exercises.toString()}]}`;
  await db.run('INSERT INTO Workout VALUES (?, ?, ? , ?, ?)', [id, n, level,duration, listofExercises]);

  return listWorkout();
}

export async function editWorkout(id, updatedWorkout) {
  const db = await dbConn;

  const name = updatedWorkout.name;
  const level = updatedWorkout.level;
  const duration = updatedWorkout.duration;
  const exercises = updatedWorkout.exercises;

  const statement = await db.run('UPDATE Workout SET name = ? ,level = ? , duration = ?, exercises = ? WHERE id = ?', [name, level,duration , exercises, id]);

  // if nothing was updated, the ID doesn't exist
  if (statement.changes === 0) throw new Error('Workout not found');

  return findWorkout(id);
}
