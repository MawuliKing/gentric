
import * as admin from 'firebase-admin';
import * as fs from 'fs';

export const initializeFirebase = () => {
  // const googleServices = JSON.parse(
  //   fs.readFileSync('src/api/notification/config/json-file.json', 'utf-8'),
  // );

  // // Initialize Firebase with the service account file
  // admin.initializeApp({
  //   credential: admin.credential.cert(googleServices),
  // });

  console.info('Firebase initialized____');
};
