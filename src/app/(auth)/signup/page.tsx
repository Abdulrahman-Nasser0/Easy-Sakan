import SignUpForm from './SignUpForm';

const Signup = () => {
  return (
  <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Join Easy Sakan
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account and discover amazing properties
            </p>
          </div>
          
          {/* Sign Up Form */}
          <SignUpForm />
          
          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup