'use client';

import { login } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/common/Button";
import Link from "next/link";

const LoginForm = () => {
    const [state, loginAction] = useActionState(login, undefined);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-8">
            <form action={loginAction} className="space-y-6">
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
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        placeholder="Enter your password" 
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors"
                        required
                    />
                    {state?.errors?.password && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-sky-400 hover:text-sky-300 font-medium">
                        Forgot your password?
                    </Link>
                </div>

                <SubmitButton />

                <div className="text-center pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
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
