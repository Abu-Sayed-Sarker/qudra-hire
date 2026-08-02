"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          }
        }}
        onError={onError}
        shape="rectangular"
        size="large"
        text="signin_with"
        theme="outline"
        containerProps={{
          className: "w-full",
        }}
      />
    </GoogleOAuthProvider>
  );
}
