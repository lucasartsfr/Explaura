import { useState } from 'react'
import './Admin.css'
import Login from './Login';
import Explaura from './Explaura';

function App() {

  const [isUser, setIsUSer] = useState('');
  const [loading, setLoading] = useState(true);

  return (
    // <FirebaseProvider>
      <div className="Admin">
          {
            isUser && <Explaura loading={loading} setLoading={setLoading}/>
          }
          <Login loading={loading} setLoading={setLoading} setIsUSer={setIsUSer} isUser={isUser}/>   
      </div>
    // </FirebaseProvider>
  )
}

export default App
