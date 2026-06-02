'use client';

import { signUp } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/common/Button";
import Link from "next/link";

const SignUpForm = () => {
    const [state, signUpAction] = useActionState(signUp, undefined);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-8">
            <form action={signUpAction} className="space-y-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-slate-300 mb-2">
                        I am a...
                    </label>
                    <select 
                        name="role"
                        id="role"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors appearance-none cursor-pointer"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Select your role</option>
                        <option value="Student">Student (Looking for accommodation)</option>
                        <option value="Landlord">Landlord (Offering properties)</option>
                    </select>
                    {state?.errors?.role && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.role[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-300 mb-2">
                        Full Name
                    </label>
                    <input 
                        type="text" 
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    {state?.errors?.fullName && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.fullName[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        placeholder="Enter your email address" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    {state?.errors?.email && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-300 mb-2">
                        Phone Number (Egyptian)
                    </label>
                    <input 
                        type="tel" 
                        name="phone"
                        id="phone"
                        placeholder="01XXXXXXXXX or +201XXXXXXXXX" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    {state?.errors?.phone && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.phone[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        placeholder="Create a strong password" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    <p className="text-slate-500 text-xs mt-2">
                        Password must be at least 8 characters with uppercase, number, and special character
                    </p>
                    {state?.errors?.password && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2">
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    {state?.errors?.confirmPassword && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.confirmPassword[0]}
                        </p>
                    )}
                </div>

                <SubmitButton />

                <div className="text-center pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
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
