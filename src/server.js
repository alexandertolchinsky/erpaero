import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import addRoutes from './routes/add-routes.js';
import dataSource from '../data_source.js';

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(async (request, response, next) => {
  app.dataSource = dataSource;
  next();
});

app.use(cors());

app.use(async (request, response, next) => {
  if (!request.headers.authorization) {
    return next();
  }
  const [authType, token] = request.headers.authorization.split(' ');
  if (authType !== 'Bearer') {
    return next();
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const user = await app.dataSource.getRepository('User').findOneBy({ token });
    request.user = user;
  } catch (error) {
    return next();
  }
  next();
});

addRoutes(app);

app.listen(port, async () => {
  await dataSource.initialize();
  console.log(`Server listening at http://[::]:${port}`);
});
