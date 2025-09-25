import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon} from "lucide-react";
import { Link } from "react-router";


const SignUpPage = () => {

  const [formData, setFormData] = useState( {initusername: "", initemail: "", initpassword: ""} )
  const {signup, isSigningUp} = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  }

  return (
    <div className = "w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">

        <BorderAnimatedContainer> 
          <div className="w-full flex flex-col md:flex-row">

            {/* Form column left side */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">

                {/* heading text */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4"/>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>
                
                {/*Form  */}
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* full name */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon"/>

                      <input 
                        type="text" 
                        value= {formData.fullName}
                        onChange={(e) => setFormData({...formData, initusername: e.target.value})}
                        className="input"
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon"/>

                      <input 
                        type="email" 
                        value= {formData.email}
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
                        value= {formData.password}
                        onChange={(e) => setFormData({...formData, initpassword: e.target.value})}
                        className="input"
                        placeholder="Enter your password" 
                      />
                    </div>
                  </div>

                  {/* submit button  */}
                  <button className="auth-btn" type="submit" disabled = {isSigningUp}>
                    { isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center"/>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                </form>

                {/* Link */}
                <div className="mt-6 text-center">
                  <Link to="/login" className = "auth-link">
                    Already have an account
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </BorderAnimatedContainer >

      </div>
    </div>
  )
}

export default SignUpPage