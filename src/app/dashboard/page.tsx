// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your account</p>
        </div>
      
    </div>
  )
}

export default Dashboard
