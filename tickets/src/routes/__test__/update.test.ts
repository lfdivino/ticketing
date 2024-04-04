import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const generateTicketId = () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    return id;
}

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Test ticket',
            price: 25
        });
};

it('returns a 404 if the provided id does not exist', async () => {
    await request(app).put(`/api/tickets/${generateTicketId()}`).set('Cookie', global.signin()).send({ title: 'Test PUT Tickets', price: 20 }).expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
    await request(app).put(`/api/tickets/${generateTicketId()}`).send({ title: 'Test PUT Tickets', price: 20 }).expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
    const ticketResponse = await createTicket();

    await request(app).put(`/api/tickets/${ticketResponse.body.id}`).set('Cookie', global.signin()).send({ title: 'Test PUT Tickets', price: 20 }).expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    await request(app).put(`/api/tickets/${generateTicketId()}`).set('Cookie', global.signin()).send({}).expect(400);
    await request(app).put(`/api/tickets/${generateTicketId()}`).set('Cookie', global.signin()).send({ title: 'Test Put Ticket' }).expect(400);
    await request(app).put(`/api/tickets/${generateTicketId()}`).set('Cookie', global.signin()).send({ price: 20.5 }).expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const responseTicket = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'Test Tickect', price: 15.50 });
    await request(app).put(`/api/tickets/${responseTicket.body.id}`).set('Cookie', cookie).send({ title: 'Test PUT Tickect', price: 19.99 }).expect(200);

    const ticketGetResponse = await request(app).get(`/api/tickets/${responseTicket.body.id}`).send();

    expect(ticketGetResponse.body.title).toEqual('Test PUT Tickect');
    expect(ticketGetResponse.body.price).toEqual(19.99);
});