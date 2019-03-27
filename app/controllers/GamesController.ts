import { Router, Request, Response } from 'express';
import GameSchema from '../models/GameModel';
import { Socket } from 'socket.io';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.send(await GameSchema.find());
});

router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;

    try {
        res.send(await GameSchema.findById(id));
    } catch (error) {
        res.status(404).end();
    }
});

router.post('/', async (req: Request, res: Response) => {
    let { name } = req.body;

    const newGame = await GameSchema.create({ name });

    res.status(201).end();

    const io: Socket = res.locals.io;
    io.emit("new-game", { _id: newGame._id, name: newGame.get("name") });
});

router.patch('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    let { name } = req.body;

    try {
        await GameSchema.findByIdAndUpdate(id, { name });
    } catch (error) {
        res.status(404).end();
        return;
    }

    res.status(204).end();

    const io: Socket = res.locals.io;
    io.emit(`game-edit-${id}`, { name: name });
});

router.delete('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    let toBeDeleted = null;

    try {
        toBeDeleted = await GameSchema.findById(id);
        await GameSchema.findByIdAndDelete(id);
    } catch (error) {
        res.status(404).end();
        return;
    }

    if (!toBeDeleted) {
        res.status(404).end();
        return;
    }

    res.status(204).end();

    const io: Socket = res.locals.io;
    io.emit("delete-game", { _id: toBeDeleted._id, name: toBeDeleted.get("name") });
    io.emit(`delete-game-${toBeDeleted._id}`);
});

router.post('/:id/aspect', async (req: Request, res: Response) => {
    let { id } = req.params;
    let { name } = req.body;
    let game = null;

    try {
        await GameSchema.updateOne(
            { _id: id },
            { $push: { aspects: { name } } }
        );
        game = await GameSchema.findById(id);
    } catch (error) {
        res.status(404).end();
        return;
    }

    if (!game) {
        res.status(404).end();
        return;
    }

    res.status(201).end();

    const io: Socket = res.locals.io;
    io.emit(`new-aspect-${id}`, { _id: game.get("aspects").slice(-1)[0]._id, name: name });
});

const GamesController: Router = router;

export default GamesController;