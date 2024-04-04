import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotAuthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@lfdivino/common';
import { body } from 'express-validator';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero')
    ], 
    validateRequest, currentUser, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: 'Test PUT Tickect',
        price: 19.99
    });

    await ticket.save();

    res.send(ticket);
});

export { router as updateTicketRouter }
