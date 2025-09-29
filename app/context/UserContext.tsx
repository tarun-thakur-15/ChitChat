"use client";

import React, { createContext, useContext } from "react";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  joinedOn?: string;
  totalFriends?: number;
  isFriend?: boolean;
  hasSendFriendRequest?: boolean;
}

interface UserContextProps {
  user: User | null;
}

const UserContext = createContext<UserContextProps>({ user: null });

export const UserProvider = ({ user, children }: { user: User | null; children: React.ReactNode }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
