import sha256 from 'js-sha256';

// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { app } from './firebase.js';
import { signInFirebaseAuth, signOutFirebaseAuth } from './auth.js';

export const firestore = getFirestore(app);

export async function getPasswordCode(user, id) {
  const docRef = doc(firestore, 'auth', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().encoded;
  } else {
    throw Error('404, The user and moment ID are missing.');
  }
}

/**
 * 모멘트 데이터 존재 여부
 * @param {string} user 모멘트 생성자 id
 * @param {string} id 모멘트 id
 * @returns {boolean} firestore 모멘트 데이터 존재 여부
 */
export async function isExistedMoment(user, id) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}

export async function getMomentData(user, id) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error('404');
  }
}

export async function createMoment(user, id, password) {
  await signInFirebaseAuth();
  await createAuthData(user, id, password);
  await createMomentData(user, id, {
    username: user,
    timestamp: Date.now(),
    title: id,
    description: `@${user}의 새 모멘트`,
    tweets: []
  });
  await signOutFirebaseAuth();
}

export async function createAuthData(user, id, password) {
  const docRef = doc(firestore, 'auth', `${user}:${id}`);
  await setDoc(docRef, { encoded: sha256(password) });
}

export async function createMomentData(user, id, obj) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  await setDoc(docRef, obj);
}

export async function updateMomentData(user, id, obj) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  await updateDoc(docRef, obj);
}