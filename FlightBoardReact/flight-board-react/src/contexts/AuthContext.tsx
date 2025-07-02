import { createContext, useContext } from 'react';

const AuthContext = createContext({ isLoggedIn: false });

export const useAuth = () => useContext(AuthContext);
