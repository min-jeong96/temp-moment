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

  const tweetsFromFirestore = [];
  querySnapshot.forEach((doc) => {
    tweetsFromFirestore.push({ id: doc.id, ...doc.data() });
  });

  // 모멘트 목록에 맞게 처리
  const preprocessTweetData = (metadata, tweets) => {
    const getAttachmentKey = (url) => {
      return url.split('/')[url.split('/').length - 1].split('.')[0];
    }

    const preprocessed = metadata.tweets_id.map((id) => {
      let tweet = tweets.find(t => t.id === id);
      let { attachments, created_at, ...data } = tweet;

      return {
        isValidData: true,
        attachments: tweet.attachments.map((attachment, index) => {
          return {
            key: getAttachmentKey(attachment),
            url: attachment,
            alt: `${index + 1}번째 jpg 또는 gif, video 썸네일`
          }
        }),
        created_at: new Date(tweet.created_at),
        ...data
      }
    });
    return preprocessed;
  }

  const momentDataFromFirestore = await getMomentData(user, id);
  const tweets = preprocessTweetData(momentDataFromFirestore, tweetsFromFirestore);

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