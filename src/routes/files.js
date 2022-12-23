import multer from 'multer2';
import dotenv from 'dotenv';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';
import { unlink } from 'fs';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

export default (app) => {
  app.get('/file/download/:id', async (request, response) => {
    const { id } = request.params;
    const file = await app.dataSource.getRepository('File').findBy({ id });
    const { path } = file[0];
    response.sendFile(path);
  });

  app.get('/file/list', async (request, response) => {
    const listSize = request.query.list_size || 10;
    const page = request.query.page || 1;
    const offset = listSize * (page - 1);
    const files = await app.dataSource.getRepository('File').find({ take: listSize, skip: offset });
    response.send(files);
  });

  app.get('/file/:id', async (request, response) => {
    const { id } = request.params;
    const file = await app.dataSource.getRepository('File').findBy({ id });
    response.send(file);
  });

  const uploadDirPath = join(__dirname, '..', '..', process.env.UPLOAD_DIR_NAME);
  app.post('/file/upload', multer({ dest: uploadDirPath }).single('file'), async (request, response) => {
    const {
      originalname,
      mimetype,
      path,
      size,
    } = request.file;
    const { name, ext: extension } = parse(originalname);
    await app.dataSource.getRepository('File').save({
      name,
      size,
      path,
      mimetype,
      extension,
    });
    response.end();
  });

  app.delete('/file/delete/:id', async (request, response) => {
    const { id } = request.params;
    const file = await app.dataSource.getRepository('File').findBy({ id });
    const { path } = file[0];
    unlink(path, () => {});
    await app.dataSource.getRepository('File').delete({ id });
    response.end();
  });

  app.put('/file/update/:id', multer({ dest: uploadDirPath }).single('file'), async (request, response) => {
    const { id } = request.params;
    const {
      originalname,
      mimetype,
      path,
      size,
    } = request.file;
    const { name, ext: extension } = parse(originalname);
    await app.dataSource.getRepository('File').update(id, {
      name,
      extension,
      mimetype,
      path,
      size,
    });
    response.end();
  });
};
