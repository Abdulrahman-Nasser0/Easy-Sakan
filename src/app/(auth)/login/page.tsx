// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import LoginForm from './LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your Easy Sakan account
          </p>
        </div>
        
        {/* Login Form */}
        <LoginForm />
        
        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
