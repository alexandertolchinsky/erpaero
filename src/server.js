import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

addRoutes(app);

app.listen(port, async () => {
  await dataSource.initialize();
  console.log(`Server listening at http://[::]:${port}`);
});
