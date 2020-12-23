const admin = require('firebase-admin');
const logger = require('../../server/logger') 

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/ufc-fight-predictor%40appspot.gserviceaccount.com"
}


const connectDb = () => {

    try {
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        });
    
        const db = admin.firestore();

        logger().info('Successfully setup connection to Firestore')
    
        return db
    } catch (err) {
        logger().error(`Unable to connect to Firestore ${err.stack}`);
        throw err;
    }
}

module.exports = connectDb
