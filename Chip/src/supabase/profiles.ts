import {getCurrentUid} from './auth';
import {supabase} from './supabase';

export async function updateUsername(newUsername: string) {
  const uid = await getCurrentUid();

  const {error} = await supabase
    .from('profiles')
    .update({username: newUsername})
    .eq('id', uid);

  if (error) {
    throw Error(error.message);
  }
}
