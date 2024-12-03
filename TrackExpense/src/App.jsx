import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Home'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { useEffect,useState } from 'react'
import { supabase } from './supabaseClient'
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setUser(sessionData.session.user);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
  }, []);
  return (
    <>
      <Router>
        <Routes>
          {user ? <Route path="/" element={<Home user={user}/>} /> : <Route path="/login" element={<Login />} />}
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App