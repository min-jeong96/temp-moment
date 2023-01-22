// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from './firebase.js';

const firestore = getFirestore(app);

async function getPasswordCode(user, id) {
  const docRef = doc(firestore, 'auth', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().encoded;
  } else {
    throw Error('404, The user and moment ID are missing.');
  }
}

async function getMomentData(user, id) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error('404');
  }
}

async function updateMomentData(user, id, obj) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  await updateDoc(docRef, obj);
}

export { firestore, getPasswordCode, getMomentData, updateMomentData };