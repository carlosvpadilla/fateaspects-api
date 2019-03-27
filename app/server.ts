import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import { GamesController, AspectsController } from './controllers';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ioBase from 'socket.io';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: express.Application = express();
const port: number = Number.parseInt(process.env.PORT || "3000");
const server = new http.Server(app);
const io = ioBase(server);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || "",  { useNewUrlParser: true });
const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());
app.use((request: Request, response: Response, next: NextFunction) => {
    response.locals.io = io;
    return next();
});
app.use('/games', GamesController);
app.use('/aspects', AspectsController);

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    server.listen(port, () => {
        console.log(`Listening at http://localhost:${port}/`);
    });

    io.on('connection', client => {
        console.log('Connection: ' + client.id);
    });
});