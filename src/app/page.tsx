import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <SignedIn>
        {/* Redirect authenticated users to dashboard */}
        {/* {redirect('/dashboard')} */}
        <Button>
          <a href="/dashboard" className="text-lg font-semibold">
            Go to Dashboard
          </a>
        </Button>
      </SignedIn>
      
      <SignedOut>
        <div className="text-center space-y-6 max-w-2xl px-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Manage Your Stock Portfolio
          </h1>
          <p className="text-lg text-gray-600">
            Track your investments, analyze performance, and make informed decisions with our powerful stock management platform.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}
