import { Navigate, Route, Routes } from "react-router";

import ChatPage from "./modules/chat/pages/ChatPage";
import LoginPage from "./modules/auth/pages/LoginPage"; 
import SignUpPage from "./modules/auth/pages/SignUpPage"; 
import { useAuthStore } from "./modules/auth/useAuthStore"; 
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

import GroupsPages from "./modules/groups/pages/GroupsPages";
import GroupPage from "./modules/groups/pages/GroupPage";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import UserProfile from "./modules/users/pages/UserProfile";



const App = () => {

  const {checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect (() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser})

  if(isCheckingAuth) return <PageLoader />

  return (
    
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

    {/* Decorators -Grid bg and glow shapes */}
     {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" /> */}

      <Routes>
        <Route path = "/" element = { authUser ? <GroupsPages /> : <Navigate to= {"/login"}/>} />
        <Route path = "/group/:groupId" element = { authUser ? <GroupPage /> : <Navigate to= {"/login"}/>} />
        <Route path = "/settings" element = { authUser ? <SettingsPage /> : <Navigate to= {"/login"}/>} />
        <Route path = "/user-profile" element = { authUser ? <UserProfile /> : <Navigate to= {"/login"}/>} />
        <Route path = "/login" element = {!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path = "/signup" element = {!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{duration: 2000}}/>

    </div>
  )
}

export default App