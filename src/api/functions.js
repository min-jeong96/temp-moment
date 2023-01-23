import { getFunctions } from 'firebase/functions';
import { app } from './firebase.js'

const functions = getFunctions(app);

export { functions };