import admin from 'firebase-admin';

// Only initialize if we have the service account
let adminDb: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    adminDb = admin.firestore();
    auth = admin.auth();
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export { adminDb, auth }; 