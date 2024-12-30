"use client";

import { useEffect, useState } from "react";

import Parse from "parse";

import { SubClasses } from "../lib/parse/class";
import { IParseServerAPICred, ParseInitialize } from "../lib/parse/initialize";

export const useParseConnect = (parseConfig: IParseServerAPICred) => {
  const [user, setUser] = useState<Parse.User<Parse.Attributes>>();
  const [loadingParse, setLoadingParse] = useState(true);
  useEffect(() => {
    const getConnected = async () => {
      const cloud = new ParseInitialize(parseConfig, SubClasses);
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoadingParse(false);
    };

    getConnected();
  }, [parseConfig]);

  return { user, loadingParse };
};

export function useAuth() {
  const [authLoading, setAuthLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await Parse.User.logIn(email, password);
      setAuthLoading(false);
      // Do something after successful login, like redirecting the user
    } catch (error) {
      console.error('Error logging in', error);
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await Parse.User.logOut();
      // Perform any post-logout actions
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return {
    signIn,
    signOut,
    authLoading,
  };
}