import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import multer from 'multer2';

dotenv.config();

export default (app) => {
  app.post('/signup', multer().none(), async (request, response) => {
    const { username, password } = request.body;
    const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN * 2,
    });
    const user = await app.dataSource.getRepository('User').save({
      username,
      password_digest: passwordDigest,
      token,
      refresh_token: refreshToken,
    });
    response.send(user);
  });

  app.post('/signin', multer().none(), async (request, response) => {
    const { username, password } = request.body;
    const user = await app.dataSource.getRepository('User').findBy({ username });
    const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');
    if (user[0].password_digest === passwordDigest) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN * 2,
      });
      await app.dataSource.getRepository('User').update(user[0].id, {
        token,
        refresh_token: refreshToken,
      });
      response.send({
        token,
        refresh_token: refreshToken,
      });
    }
    response.end();
  });

  app.get('/logout', async (request, response) => {
    const id = request.userId;
    if (id) {
      await app.dataSource.getRepository('User').update(id, {
        token: 'NULL',
        refresh_token: 'NULL',
      });
    }
    response.end();
  });

  app.get('/info', (request, response) => response.send({ username: request.user.username }));

  app.post('/signin/new_token', multer().none(), async (request, response) => {
    const { refresh_token } = request.body;
    const user = await app.dataSource.getRepository('User').findBy({ refresh_token });
    if (user[0].id) {
      const token = jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN * 2,
      });
      await app.dataSource.getRepository('User').update(user[0].id, {
        token,
        refresh_token: refreshToken,
      });
      response.send({
        refreshToken,
        token,
      });
    }
    response.end();
  });
};
