import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { app } from './firebase.js';
import { getPasswordCode } from './firestore.js';
import sha256 from 'js-sha256';

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export function signInFirebaseAuth() {
  return new Promise((resolve, reject) => {
    signInAnonymously(auth)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(new Error(error.message));
      })
  });
}

export function signOutFirebaseAuth() {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(new Error(error.message));
      })
  });
}

export async function login(user, id, password) {
  let encoded;

  try {
    encoded = await getPasswordCode(user, id);
  } catch (error) {
    // 존재하지 않는 username, moment id
    console.error(error);
  }

  if (encoded === sha256(password)) {
    const user = await signInFirebaseAuth();
    console.log('login: ', user);
  } else {
    // 비밀번호가 일치하지 않는다.
    console.error('login failed');
  }
}

export async function logout() {
  const result = await signOutFirebaseAuth();
  console.log('logout:', result);
}