import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

const initialUserContext: UserContextType = {
  userName: '',
  setUserName: () => {},
};

const UserContext = createContext<UserContextType>(initialUserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>(initialUserContext.userName);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

