import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import multer from 'multer2';

dotenv.config();

export default (app) => {
  app.post('/signup', multer().none(), async (request, response) => {
    if (!request.body) {
      response.status(400).end();
      return;
    }
    const { username, password } = request.body;
    const isUniqUsername = await app.dataSource.getRepository('User').findOneBy({ username }) === null;
    if (!isUniqUsername) {
      response.status(400).end();
      return;
    }
    const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');
    const newToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const user = await app.dataSource.getRepository('User').save({
      username,
      password_digest: passwordDigest,
      token: newToken,
      refresh_token: newRefreshToken,
    });
    response.send(user);
  });

  app.post('/signin', multer().none(), async (request, response) => {
    const { username, password } = request.body;
    const user = await app.dataSource.getRepository('User').findOneBy({ username });
    const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password_digest !== passwordDigest) {
      response.status(403).end();
      return;
    }
    const newToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    await app.dataSource.getRepository('User').update(user.id, { token: newToken, refresh_token: newRefreshToken });
    response.send({ token: newToken, refreshToken: newRefreshToken });
  });

  app.get('/logout', async (request, response) => {
    if (!request.user) {
      response.status(403).end();
      return;
    }
    const { id } = request.user;
    await app.dataSource.getRepository('User').update(id, {
      token: 'NULL',
      refresh_token: 'NULL',
    });
    response.end();
  });

  app.get('/info', (request, response) => {
    if (!request.user) {
      response.status(403).end();
      return;
    }
    response.send({ username: request.user.username });
  });

  app.post('/signin/new_token', multer().none(), async (request, response) => {
    const { refreshToken } = request.body;
    const user = await app.dataSource.getRepository('User').findOneBy({ refresh_token: refreshToken });
    if (!user) {
      response.status(403).end();
      return;
    }
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      response.status(403).end();
      return;
    }
    const newToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    await app.dataSource.getRepository('User').update(user.id, { token: newToken, refresh_token: newRefreshToken });
    response.send({ token: newToken, refreshToken: newRefreshToken });
  });
};
