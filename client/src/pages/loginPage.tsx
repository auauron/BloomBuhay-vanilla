import React, { useState} from "react";
import{ useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ValidationError } from "../types/auth";
import InputField from "../components/inputField";

export default function LoginPage() {
    const navigate = useNavigate()
    const[email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [generalError, setGeneralError] = useState('')

    const getFieldError = (fieldName: string): string | undefined => {
        return errors.find((err) => err.field === fieldName)?.message
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setGeneralError('')

    const result = await authService.login({ email, password })

    setLoading(false)

    if(result.success) {
        navigate('/dashboard')
    }else{
        if (result.errors) setErrors(result.errors)
        if (result.error) setGeneralError(result.error)

    }
    }

    const handleSignupRedirect = () => {
        navigate('/signup')

    }
    //placeholder route
    const handleforgotPassword = () => {
        navigate('/forgot-password'); 
    }
    return (
        <div className="min-h-screen bg-bloomWhite flex items-center justify-center">
            <div className="max-w-3xl w-full">
                {/* logo and header */}
                <div className="text-center mb-6">
                    <img src="../assests/logo_pink.webp" alt="logo" className="h-56"/>
                    <h1 className="font-poppins text-7xl font-bold text-bloomPink -ml-12">
                        Bloom <br/> Buhay
                    </h1>
                </div>

                <h2 className="font-rubik text-xl font-bold text-gray-800">
                    Welcome back!
                </h2>
                <p className="font-rubik text-gray-600 text-xs -mb-2">
                    Continue your journey of motherhood.
                </p>
            </div>

            {/* forms */}
            <div className="bg-white rounded-2xl w-500 shadow-lg p-8 pl-16 pr-16">
                {generalError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="Enter your email" error={getFieldError('email')}/>
                    <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" error={getFieldError('password')}/>

                    <div className="text-center text-xs text-gray-400 -mt-2 mb-2">
                        <button type="button" onClick={handleforgotPassword} className="hover:underline">
                            Forgot Password?
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 min-w-[500px]">
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
    
};