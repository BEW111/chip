import messaging from '@react-native-firebase/messaging';
import {supabase} from '../supabase/supabase';

// We should run this every time the application boots or the account has changed.
// This gets a new token and saves it to the database
export async function upsertMessagingToken(uid: string) {
  // Get the token
  const token = await messaging().getToken();

  console.log('[upsertMessagingToken] updating FCM token');

  // Save the token to the database
  const {error} = await supabase.from('user_fcm_tokens').upsert({
    uid,
    token,
  });

  if (error) {
    console.log(error);
  }
}

// We should run this every time the user logs out
// This will wipe our messaging token from the database
export async function clearMessagingToken(uid: string) {
  const {error} = await supabase
    .from('user_fcm_tokens')
    .delete()
    .eq('uid', uid);

  if (error) {
    console.log(error);
  }
}
