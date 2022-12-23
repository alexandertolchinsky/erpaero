import files from './files.js';
import users from './users.js';

const controllers = [files, users];

export default (app) => controllers.forEach((controller) => controller(app));
