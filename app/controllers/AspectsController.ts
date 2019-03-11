import { Router, Request, Response } from 'express';
import GameSchema from '../models/GameModel';

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
});

router.delete('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;

    try {
        await GameSchema.findOneAndUpdate(
            { "aspects._id": id },
            { $pull: { aspects: { _id: id } } }
        );
    } catch (error) {
        res.status(404).end();
        return;
    }

    res.status(204).end();
});

const AspectsController: Router = router;

export default AspectsController;