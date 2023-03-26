
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

import ChatGPT from './ChatGPT/ChatGPT'
import Login from './login';
import Profile from './Profile';

import RouteGuard from './RouteGuard';

const amplifyConfig = {
  Auth: {
    mandatorySignIn: false,
    region: import.meta.env.VITE_APP_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    // identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },
};

// console.log(amplifyConfig)
Amplify.configure(amplifyConfig);


function NavBar() {
  const { user } = useAuthenticator((context) => [context.user]);
return(
  <nav className='bg-slate-700 text-white'>
  <ul className='flex gap-10 px-5 py-2'>
    <li>
      <Link to="/">Home</Link>
    </li>
    {user ? (
    <li>
      <Link to="/profile">Profile</Link>
    </li>
    ) : (
    <li>
      <Link to="/login">Login</Link>
    </li>
    )}
  </ul>
</nav>
);
}

export default function App() {
  return (
    
    // <ChatGPT></ChatGPT>
    <Authenticator.Provider>

      <BrowserRouter>
      <NavBar></NavBar>

      <main>
        <Routes>
          <Route path="/" element={<ChatGPT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<RouteGuard><Profile /></RouteGuard>} />
        </Routes>
      </main>
    </BrowserRouter>
    </Authenticator.Provider>

  )
}