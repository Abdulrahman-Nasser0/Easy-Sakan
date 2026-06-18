'use client';

import { login } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/common/Button";
import Link from "next/link";

const LoginForm = () => {
    const [state, loginAction] = useActionState(login, undefined);

    return (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
            <form action={loginAction} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        placeholder="Enter your email address" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    {state?.errors?.email && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        placeholder="Enter your password" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    {state?.errors?.password && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-[#0071c2] hover:text-[#005999] font-medium">
                        Forgot your password?
                    </Link>
                </div>

                <SubmitButton />

                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-[#0071c2] hover:text-[#005999] font-semibold transition-colors">
                            Sign up now
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
            {pending ? "Signing In..." : "Sign In"}
        </Button>
    );
}

export default LoginForm;
