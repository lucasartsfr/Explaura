import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc  } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll  } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAacQucvyT2ettJ_tAzr8zOCuMVGzY6Mhw",
    authDomain: "explaura-app.firebaseapp.com",
    projectId: "explaura-app",
    storageBucket: "explaura-app.appspot.com",
    messagingSenderId: "1035888407498",
    appId: "1:1035888407498:web:dd69b2f2e4641abe8d1533",
    measurementId: "G-57QGWF9DYQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

// Login
const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged')
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// SignOut
const logOut = () => {
    signOut(auth);
};

//get Data
const getData = async (mycollection, mydoc) => {
    const docRef = doc(collection(db, mycollection), mydoc);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        return docSnap.data();
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log(error);
    }
};

// Add data to Database
const addData = async (myJSON ,mycollection, mydoc) => {
    const docRef = doc(collection(db, mycollection), mydoc);
  
    try {
      await updateDoc(docRef, myJSON);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };


//Upload a file  
const uploadFile = async (file, folder) => {
const storageRef = ref(storage, folder+'/' + file.name);
await uploadBytes(storageRef, file);
console.log('Fichier téléchargé avec succès !');
}

// Get Files URL
const getFilesDownloadURLs = async (folderPath) => {
    const folderRef = ref(storage, folderPath);
    const filesList = await listAll(folderRef);
    const urls = await Promise.all(filesList.items.map(async (fileRef) => {
      const url = await getDownloadURL(fileRef);
      return url;
    }));
    return urls;
  };

export { db, auth, storage, logInWithEmailAndPassword, logOut, getData, addData, uploadFile, getFilesDownloadURLs };