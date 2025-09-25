import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, LoaderIcon} from "lucide-react";
import { Link } from "react-router";


const LoginPage = () => {

  const [formData, setFormData] = useState( {initemail: "", initpassword: ""} )
  const {login,  isLoggingIn} = useAuthStore()

  const handleSubmit = (e) => {
      e.preventDefault();
      login(formData);
  }
 

  return (
    <div className = "w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">

        <BorderAnimatedContainer> 
          <div className="w-full flex flex-col md:flex-row">

                        {/* Form column left side */}
            <div className="relative z-10 md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">

                {/* heading text */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4"/>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                  <p className="text-slate-400">Login to access your account</p>
                </div>
                
                {/*Form  */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon"/>

                      <input 
                        type="email" 
                        value= {formData.initemail}
                        onChange={(e) => setFormData({...formData, initemail: e.target.value})}
                        className="input"
                        placeholder="johnDoe@gmail.com" 
                      />
                    </div>
                  </div>

                  {/* password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon"/>

                      <input 
                        type="password" 
                        value= {formData.initpassword}
                        onChange={(e) => setFormData({...formData, initpassword: e.target.value})}
                        className="input"
                        placeholder="Enter your password" 
                      />
                    </div>
                  </div>

                  {/* submit button  */}
                  <button className="auth-btn" type="submit" disabled = {isLoggingIn}>
                    { isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center"/>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                </form>

                {/* Link */}
                <div className="mt-6 text-center">
                  <Link to="/signup" className = "auth-link">
                    Don't have an account? SIgn Up
                  </Link>
                </div>

              </div>
            </div>

                  {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="
              absolute inset-0    /* full background on small screens */
              md:static           /* normal half-width on md+ */
              w-full md:w-1/2
              flex items-center justify-center 
              p-6 
              bg-gradient-to-bl from-slate-800/20 to-transparent
              z-0
            ">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain opacity-10 md:opacity-100"
                />
                <div className="mt-6 text-center hidden md:block">
                  <h3 className="text-xl font-medium text-cyan-400">Connect anywhere, anytime</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </BorderAnimatedContainer>

      </div>
    </div>
  )
}

export default LoginPage