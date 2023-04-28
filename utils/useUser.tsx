import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';



type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: { [x: string]: any } | null;
  isLoading: boolean;
  subscription: { [x: string]: any }[] | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();

  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<{ [x: string]: any } | null>(null);
  const [subscription, setSubscription] = useState<{ [x: string]: any }[] | null>(null);

  const getUserDetails = () => supabase.from('users').select("*").single();
  const getSubscription = () => supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['activeIncomplete', 'complete']);
  const getStudents = () => supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['activeIncomplete', 'complete'])
    .eq('instructor_assigned', user?.id)

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription(), getStudents()]).then(
        (results) => {
          console.log("results=>r", results)
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];
          const studentsPromise = results[2];

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data);

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data);


          setIsloadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};

