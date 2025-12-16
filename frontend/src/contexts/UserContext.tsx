'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { getUserPlan } from '@/app/api';

interface UserContextType {
    sub: string | null;
    plan: string | null;
    isProcessing: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const { user, isLoading, isAuthenticated } = useAuth0();
    const [sub, setSub] = useState<string | null>(null);
    const [plan, setPlan] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated && user?.sub && sub !== user.sub) {
            setSub(user.sub);
            sendSubToApi(user.sub);
        }

        if (!isAuthenticated) {
            setSub(null);
            setPlan(null);
        }
    }, [isAuthenticated, user, isLoading, sub]);

    const sendSubToApi = async (userSub: string) => {
        try {
            setIsProcessing(true);
            const data = await getUserPlan(userSub);
            const userPlan = data || null;
            setPlan(userPlan);
            console.log('User sub sent successfully:', userSub, 'Plan:', userPlan);
        } catch (error) {
            console.error('Error sending sub to API:', error);
            toast.error('Error registering user');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <UserContext.Provider value={{ sub, plan, isProcessing }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

