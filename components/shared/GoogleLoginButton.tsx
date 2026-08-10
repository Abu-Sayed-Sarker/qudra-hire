"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: (error?: any) => void;
  text?: string;
}

export default function GoogleLoginButton({ onSuccess, onError, text = "Continue with Google" }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      onSuccess(idToken);
    } catch (error) {
      console.error("Google sign in error", error);
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 dark:bg-surface-deep border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-on-surface font-medium px-6 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm text-black dark:text-white"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FcGoogle className="w-5 h-5" />
      )}
      {text}
    </button>
  );
}
