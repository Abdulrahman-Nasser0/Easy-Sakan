'use client';

import { signUp } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/common/Button";
import Link from "next/link";

const SignUpForm = () => {
    const [state, signUpAction] = useActionState(signUp, undefined);

    return (
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
            <form action={signUpAction} className="space-y-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                        I am a...
                    </label>
                    <select 
                        name="role"
                        id="role"
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Select your role</option>
                        <option value="Student">Student (Looking for accommodation)</option>
                        <option value="Landlord">Landlord (Offering properties)</option>
                    </select>
                    {state?.errors?.role && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.role[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input 
                        type="text" 
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name" 
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    {state?.errors?.fullName && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.fullName[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        placeholder="Enter your email address" 
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    {state?.errors?.email && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number (Egyptian)
                    </label>
                    <input 
                        type="tel" 
                        name="phone"
                        id="phone"
                        placeholder="01XXXXXXXXX or +201XXXXXXXXX" 
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    {state?.errors?.phone && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.phone[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        placeholder="Create a strong password" 
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    <p className="text-gray-500 text-xs mt-2">
                        Password must be at least 8 characters with uppercase, number, and special character
                    </p>
                    {state?.errors?.password && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password" 
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    />
                    {state?.errors?.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.confirmPassword[0]}
                        </p>
                    )}
                </div>

                <SubmitButton />

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200">
                            Sign in now
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            loading={pending}
            fullWidth
            className="uppercase tracking-wide font-semibold text-sm"
        >
            {pending ? "Creating Account..." : "Create Account"}
        </Button>
    );
}

export default SignUpForm;