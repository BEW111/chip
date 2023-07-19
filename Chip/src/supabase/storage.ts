import {supabase, supabaseUrl} from './supabase';

/* Avatars */

// Given file details and a username, uploads an avatar
// we store it in the user's folder for the "avatars" bucket
// and keep the original filename
// We'll also need to update the field
export async function uploadAvatar(
  uri: string,
  type: string,
  uid: string,
  fileName: string,
) {
  const photo = {
    uri: uri,
    type: type,
    name: fileName,
  };

  const formData = new FormData();
  formData.append('file', photo);

  // Get the name for the file (change the math.random part later)
  const filePath = `${uid}/${fileName}`;

  let {error: uploadError} = await supabase.storage
    .from('avatars')
    .upload(filePath, formData);

  if (uploadError) {
    console.error(uploadError);
    throw uploadError;
  }

  // Then we want to also grab the avatar url and upload it to the database,
  // so anyone can see this user's profile
  const avatarUrl = getUserAvatarUrl(uid, fileName);

  let {error: databaseError} = await supabase
    .from('profiles')
    .update({avatar_url: avatarUrl})
    .eq('id', uid);
  if (databaseError) {
    console.error(databaseError);
    throw databaseError;
  }
}

// Only works if the supplied uid and file name are correct
export function getUserAvatarUrl(uid: string, fileName: string) {
  return `${supabaseUrl}/storage/v1/object/public/avatars/${uid}/${fileName}`;
}
