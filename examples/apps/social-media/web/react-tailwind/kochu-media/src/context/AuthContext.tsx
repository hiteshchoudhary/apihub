import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
   id: '',
   name: '',
   email: '',
   username: '',
   imageUrl: '',
   bio: '',
}

const INITIAL_STATE = {
   user: INITIAL_USER,
   isLoading: false,
   isAuthenticated: false,
   setUser: () => { },
   setIsAuthenticated: () => { },
   checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<IUser>(INITIAL_USER)
   const [isLoading, setIsLoading] = useState(false);
   const [isAuthenticated, setIsAuthenticated] = useState(false)
   const navigate = useNavigate();

   const checkAuthUser = async () => {
      setIsLoading(true); // Start loading
      try {
         const currentAccount = await getCurrentUser();

         if (currentAccount) {
            setUser({
               id: currentAccount.$id,
               name: currentAccount.name,
               email: currentAccount.email,
               username: currentAccount.username,
               imageUrl: currentAccount.imageUrl,
               bio: currentAccount.bio,
            });

            setIsAuthenticated(true);
            return true;
         }
         return false;

      } catch (error) {
         console.log(error);
         return false;

      } finally {
         setIsLoading(false); // End loading
      }
   }

   useEffect(() => {
      const checkUser = async () => {
         const isLoggedIn = await checkAuthUser();

         // If not authenticated, redirect to sign-in page
         if (!isLoggedIn) {
            navigate('/sign-in');
         }
      };

      // Call the checkUser on component mount
      checkUser();
   }, []);

   const value = {
      user,
      setUser,
      isLoading,
      isAuthenticated,
      setIsAuthenticated,
      checkAuthUser
   }

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
