import { Router, Request, Response } from 'express';
import GameSchema from '../models/GameModel';
import { Socket } from 'socket.io';

const router: Router = Router();

router.patch('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    let { name } = req.body;

    try {
        await GameSchema.findOneAndUpdate(
            { "aspects._id": id },
            { "aspects.$.name": name }
        );
    } catch (error) {
        res.status(404).end();
        return;
    }

    res.status(204).end();

    const io: Socket = res.locals.io;
    io.emit(`aspect-edit-${id}`, { name: name });
});

router.delete('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    let game = null;

    try {
        game = await GameSchema.findOne({ "aspects._id": id });
        await GameSchema.findOneAndUpdate(
            { "aspects._id": id },
            { $pull: { aspects: { _id: id } } }
        );
    } catch (error) {
        res.status(404).end();
        return;
    }

    if (!game) {
        res.status(404).end();
        return;
    }

    res.status(204).end();

    const io: Socket = res.locals.io;
    io.emit(`delete-aspect-${game._id}`, { _id: id, name: "" });
});

const AspectsController: Router = router;

export default AspectsController;