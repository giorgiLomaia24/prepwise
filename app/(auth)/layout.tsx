import { isAuthenticated } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const isAutheticatedUser = await isAuthenticated();
    
        if (isAutheticatedUser){return redirect('/')};
    return (
        <div className='auth-layout'>{children}</div>
    )
}

export default AuthLayout