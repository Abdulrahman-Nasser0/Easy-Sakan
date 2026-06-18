// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import SignUpForm from './SignUpForm';

const Signup = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#1a1a2e]">
            Join Easy Sakan
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and discover amazing properties
          </p>
        </div>
        
        <SignUpForm />
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
