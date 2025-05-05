import React, { createContext } from 'react';
import { db, auth, storage, logInWithEmailAndPassword, logOut, getData, addData, uploadFile, getFilesDownloadURLs, UpdateLike} from './Firebase';

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db, auth, storage, logInWithEmailAndPassword, logOut, getData, addData, uploadFile, getFilesDownloadURLs, UpdateLike }}>
      {children}
    </FirebaseContext.Provider>
  );
};