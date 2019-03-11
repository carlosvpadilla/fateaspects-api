import { Router, Request, Response } from 'express';
import GameSchema from '../models/GameModel';

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

    await GameSchema.create({ name });

    res.status(201).end();
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
});

router.delete('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;

    try {
        await GameSchema.findByIdAndDelete(id);
    } catch (error) {
        res.status(404).end();
        return;
    }

    res.status(204).end();
});

router.post('/:id/aspect', async (req: Request, res: Response) => {
    let { id } = req.params;
    let { name } = req.body;

    try {
        await GameSchema.updateOne(
            { _id: id },
            { $push: { aspects: { name } } }
        );
    } catch (error) {
        res.status(404).end();
        return;
    }

    res.status(201).end();
});

const GamesController: Router = router;

export default GamesController;