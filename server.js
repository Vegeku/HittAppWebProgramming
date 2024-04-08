import * as w from './CRUDoperations.js';
import express from 'express';


const app = express();
app.use(express.static('frontend', { extensions: ['html'] }));


app.listen(8080);

async function getWorkouts(req, res) {
    res.json(await w.listWorkout());
}

async function getWorkout(req, res) {
    const result = await w.findWorkout(req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).send('No match for that ID.');
    }
}

async function postWorkout(req, res) {
    const workout = await w.addWorkout(req.body.name, req.body.description, req.body.duration, req.body.exercises);
    res.json(workout);
}

async function putWorkout(req, res) {
    const exercise = await w.editWorkout(req.params.id, req.body);
    res.json(exercise);
}

async function deleteWorkout(req, res) {
    res.json(await w.deleteWorkout(req.params.id));
}

app.get('/workouts', getWorkouts);
app.get('/workout/:id', getWorkout);
app.delete('/workout/:id', deleteWorkout);
app.put('/workout/:id', express.json(), putWorkout);
app.post('/workout', express.json(), postWorkout);

