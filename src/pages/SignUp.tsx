
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import Logo from "@/components/branding/Logo";

const SignUp = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Logo className="mx-auto" />
      </div>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Join JumpStart
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Create an account to share ideas and collaborate with talented people
        </p>
        <div className="flex justify-center">
          <ClerkSignUp 
            signInUrl="/sign-in"
            redirectUrl="/onboarding"
            afterSignUpUrl="/onboarding"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                footerActionLink: "text-primary hover:text-primary/90",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
