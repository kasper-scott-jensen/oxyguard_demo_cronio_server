import admin from 'firebase-admin'

export const verifySessionToken = async (token) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      console.log(error);
    }
};
