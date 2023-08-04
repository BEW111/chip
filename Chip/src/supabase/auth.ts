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

// DANGEROUS, will actually delete the current user
export async function deleteUser(uid: string) {
  // Delete relevant storage
  // Get all files to delete
  const {data: avatarFiles, error: avatarFilesError} = await supabase.storage
    .from('avatars')
    .list(uid);
  const {data: chipFiles, error: chipFilesError} = await supabase.storage
    .from('chips')
    .list(uid);

  if (avatarFilesError) {
    console.error(avatarFilesError);
  }
  if (chipFilesError) {
    console.error(chipFilesError);
  }

  // Delete the files
  if (avatarFiles) {
    const avatarFilesToRemove: string[] = avatarFiles.map(
      x => `${uid}/avatars/${x.name}`,
    );
    console.log('[deleteUser]', avatarFilesToRemove);

    await supabase.storage.from('avatars').remove(avatarFilesToRemove);
  }

  if (chipFiles) {
    const chipFilesToRemove: string[] = chipFiles.map(
      x => `${uid}/avatars/${x.name}`,
    );
    console.log('[deleteUser]', chipFilesToRemove);

    await supabase.storage.from('avatars').remove(chipFilesToRemove);
  }

  // Actually delete user
  const {data: deleteUserData, error: deleteUserError} = await supabase.rpc(
    'delete_user',
  );

  if (error) {
    console.error(error);
  }

  console.log('[deleteUser] user deleted');

  // Sign out
  await signOut();
}
