import {supabase} from './supabase';
import {AuthResult} from '../types/supabase';

export async function signUpWithEmail(
  email: string,
  username: string,
  password: string,
) {
  const {error} = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
      },
    },
  });

  let result: AuthResult;

  if (error) {
    result = {
      ok: false,
      message: error.message,
    };
  } else {
    result = {
      ok: true,
      message: null,
    };
  }

  return result;
}

export async function signInWithEmail(email: string, password: string) {
  const {error} = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  let result: AuthResult;

  if (error) {
    result = {
      ok: false,
      message: error.message,
    };
  } else {
    result = {
      ok: true,
      message: null,
    };
  }

  return result;
}

export async function signOut() {
  supabase.auth.signOut();
}

export async function getCurrentUid() {
  const userDetails = await supabase.auth.getUser();
  return userDetails.data.user?.id;
}
