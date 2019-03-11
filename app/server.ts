import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GamesController, AspectsController } from './controllers';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || "",  { useNewUrlParser: true });

const app: express.Application = express();
const port: number = Number.parseInt(process.env.PORT || "3000");

app.use(bodyParser.json());
app.use('/game', GamesController);
app.use('/aspect', AspectsController);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}/`);
    });
});