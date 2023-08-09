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

export async function verifyOtp(email: string, token: string) {
  const {error} = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
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
  const {error} = await supabase.auth.signOut();

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

export async function getCurrentUid() {
  const userDetails = await supabase.auth.getUser();
  return userDetails.data.user?.id;
}

// DANGEROUS, will actually delete the current user
export async function deleteUser(uid: string) {
  // Delete relevant storage
  // Get all files to delete
  const {data: avatarFiles} = await supabase.storage.from('avatars').list(uid);
  const {data: chipTopFiles} = await supabase.storage.from('chips').list(uid);

  // Delete avatar files (there could be multiple, since the user can update multiple times)
  if (avatarFiles) {
    const avatarFilesToRemove: string[] = avatarFiles.map(
      x => `${uid}/${x.name}`,
    );
    console.log('[deleteUser] avatar files', avatarFilesToRemove);

    await supabase.storage.from('avatars').remove(avatarFilesToRemove);
  }

  // Chip files are more complicated
  // For each chip file, we need to get all of the inner files
  let chipFilesToRemove: string[] = [];

  if (chipTopFiles) {
    const allChipSubFilesData = await Promise.all(
      chipTopFiles.map(folder =>
        supabase.storage.from('chips').list(`${uid}/${folder.name}`),
      ),
    );

    allChipSubFilesData.map(
      ({data: chipSubFiles, error: chipSubFilesError}, index: number) => {
        if (chipSubFiles) {
          console.log('chip sub files', chipSubFiles);
          chipSubFiles.forEach(x => {
            chipFilesToRemove.push(
              `${uid}/${chipTopFiles[index].name}/${x.name}`,
            );
          });
        }
      },
    );
  }

  if (chipFilesToRemove) {
    console.log('[deleteUser] chip files', chipFilesToRemove);

    await supabase.storage.from('chips').remove(chipFilesToRemove);
  }

  // Actually delete user
  const {data: deleteUserData, error: deleteUserError} = await supabase.rpc(
    'delete_user',
  );

  if (deleteUserError) {
    console.error(deleteUserError);
  }

  console.log('[deleteUser] user deleted');

  // Sign out
  await signOut();
}
