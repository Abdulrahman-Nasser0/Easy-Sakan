'use client';

import { signUp } from "@/lib/actions";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/common/Button";
import Link from "next/link";

const UNIVERSITIES = [
    { value: "Assiut University", label: "جامعة أسيوط (Assiut University)" },
    { value: "Cairo University", label: "جامعة القاهرة (Cairo University)" },
    { value: "Ain Shams University", label: "جامعة عين شمس (Ain Shams University)" },
    { value: "AUC", label: "الجامعة الأمريكية بالقاهرة (AUC)" },
    { value: "GUC", label: "الجامعة الألمانية بالقاهرة (GUC)" },
    { value: "Helwan University", label: "جامعة حلوان (Helwan University)" },
    { value: "Alexandria University", label: "جامعة الإسكندرية (Alexandria University)" },
    { value: "Mansoura University", label: "جامعة المنصورة (Mansoura University)" },
    { value: "Tanta University", label: "جامعة طنطا (Tanta University)" },
    { value: "Zagazig University", label: "جامعة الزقازيق (Zagazig University)" },
    { value: "Minia University", label: "جامعة المنيا (Minia University)" },
    { value: "Benha University", label: "جامعة بنها (Benha University)" },
    { value: "Fayoum University", label: "جامعة الفيوم (Fayoum University)" },
    { value: "Suez Canal University", label: "جامعة قناة السويس (Suez Canal University)" },
];

const SignUpForm = () => {
    const [state, signUpAction] = useActionState(signUp, undefined);
    const [selectedRole, setSelectedRole] = useState<string>('');

    return (
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-8">
            <form action={signUpAction} className="space-y-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                        I am a...
                    </label>
                    <select 
                        name="role"
                        id="role"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors appearance-none cursor-pointer"
                        required
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="" disabled>Select your role</option>
                        <option value="Student">Student (Looking for accommodation)</option>
                        <option value="Landlord">Landlord (Offering properties)</option>
                    </select>
                    {state?.errors?.role && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.role[0]}
                        </p>
                    )}
                </div>

                {selectedRole === 'Student' && (
                    <div>
                        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1.5">
                            University
                        </label>
                        <select
                            name="university"
                            id="university"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors appearance-none cursor-pointer"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select your university</option>
                            {UNIVERSITIES.map((uni) => (
                                <option key={uni.value} value={uni.value}>
                                    {uni.label}
                                </option>
                            ))}
                        </select>
                        {state?.errors?.university && (
                            <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                                <span className="mr-1">⚠️</span>
                                {state.errors.university[0]}
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                    </label>
                    <input 
                        type="text" 
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    {state?.errors?.fullName && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.fullName[0]}
                        </p>
                    )}
                </div>

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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number (Egyptian)
                    </label>
                    <input 
                        type="tel" 
                        name="phone"
                        id="phone"
                        placeholder="01XXXXXXXXX or +201XXXXXXXXX" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    {state?.errors?.phone && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.phone[0]}
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
                        placeholder="Create a strong password" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    <p className="text-gray-500 text-xs mt-2">
                        Password must be at least 8 characters with uppercase, number, and special character
                    </p>
                    {state?.errors?.password && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors"
                        required
                    />
                    {state?.errors?.confirmPassword && (
                        <p className="text-[#cc0000] text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {state.errors.confirmPassword[0]}
                        </p>
                    )}
                </div>

                <SubmitButton />

                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#0071c2] hover:text-[#005999] font-semibold transition-colors">
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
