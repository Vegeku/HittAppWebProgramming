import express from 'express';

const app = express();
app.use(express.static('javascript'));


app.listen(8080);