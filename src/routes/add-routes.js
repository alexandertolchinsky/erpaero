import files from './files.js';

const controllers = [files];

export default (app) => controllers.forEach((controller) => controller(app));
