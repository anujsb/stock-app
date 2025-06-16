import { Bell } from 'lucide-react'
import { Button } from '../ui/button'
import { SignInButton, SignOutButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Welcome back!</h1>
          <p className="text-sm text-gray-600">Track your portfolio performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
          </Button>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
          
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
