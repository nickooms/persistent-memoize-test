import { returning } from './util';

const log = returning(console.log);
const error = returning(console.error);

export { log, error };
