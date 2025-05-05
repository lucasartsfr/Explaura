import React, { useContext, useEffect  } from 'react';
import { FirebaseContext } from '../FirebaseContext';

export default function Login({isUser, setIsUSer, loading, setLoading}){

    const { auth, logInWithEmailAndPassword, logOut } = useContext(FirebaseContext);

    // Login User
    const handleSubmit = e => {        
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        logInWithEmailAndPassword(email, password);
    };


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {                
                setIsUSer(user.email)
                setLoading(false);
                console.log('Signed in user:', user.uid, user.email);
            }
            else {
                // User is signed out
                console.log('Signed out user');
                setIsUSer('')
            }
        });
    
        return () => {
          unsubscribe();
        };
      }, [auth, setIsUSer, setLoading]);
    
      if (loading && isUser) {
        return <p>Loading...</p>;
      }

    return(
        <>
            {isUser ? ( <button onClick={logOut}>Log Out</button>) : 
            (
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" />
                    <input type="password" name="password" placeholder="Password" />
                    <button type="submit">Sign in</button>
                </form>
            )}
        </>
    )
}