import request from 'supertest';
import { app } from '../../app';

it('return the logged user data', async () => {
    const cookie = await global.signup();

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('returns null if no logged user', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull;
});