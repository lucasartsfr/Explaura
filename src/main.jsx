import React from 'react';
import { FirebaseProvider } from './component/FirebaseContext';
import { createRoot } from 'react-dom/client'

import App from './App';

createRoot(document.getElementById('root')).render(
     <FirebaseProvider>  
        <App />
     </FirebaseProvider>  
)
