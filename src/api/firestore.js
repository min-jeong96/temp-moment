import sha256 from 'js-sha256';

// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query } from "firebase/firestore";
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

/**
 * 모멘트 메타데이터
 * @param {string} user 모멘트 생성자 id
 * @param {string} id 모멘트 id
 * @returns {Metadata}
 */
export async function getMomentData(user, id) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error('404');
  }
}

/**
 * 모멘트 트윗 데이터
 * @param {string} user 모멘트 생성자 id
 * @param {string} id 모멘트 id
 * @returns {Tweet[]}
 */
export async function getMomentTweets(user, id) {
  const q = query(collection(firestore, 'moments', `${user}:${id}`, 'tweets'));
  const querySnapshot = await getDocs(q);

  const tweets = [];
  querySnapshot.forEach((doc) => {
    tweets.push({ id: doc.id, ...doc.data() });
  });

  return tweets;
}

/**
 * 모멘트 메타데이터 생성
 * @param {string} user 모멘트 생성자 id
 * @param {string} id 모멘트 id
 * @param {string} password 모멘트 생성자 비밀번호
 * @returns {Tweet[]}
 */
export async function createMoment(user, id, password) {
  // firebase 익명 로그인
  await signInFirebaseAuth();

  // firestore auth 데이터 생성
  await createAuthData(user, id, password);

  // firestore 모멘트 메타데이터 생성
  await createMomentData(user, id, {
    username: user,
    timestamp: Date.now(),
    title: id,
    description: `@${user}의 새 모멘트`,
    tweets: []
  });

  // firebase 익명 로그아웃
  await signOutFirebaseAuth();
}

export async function createAuthData(user, id, password) {
  const docRef = doc(firestore, 'auth', `${user}:${id}`);
  await setDoc(docRef, { encoded: sha256(password) }); // 비밀번호 암호화
}

export async function createMomentData(user, id, obj) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  await setDoc(docRef, obj);
}

export async function updateMomentData(user, id, obj) {
  const docRef = doc(firestore, 'moments', `${user}:${id}`);
  await updateDoc(docRef, obj);
}