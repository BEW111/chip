// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.29';
import * as OneSignal from 'https://esm.sh/@onesignal/node-onesignal@2.0.1-beta1';

const _OnesignalAppId_ = Deno.env.get('ONESIGNAL_APP_ID')!;
const _OnesignalUserAuthKey_ = Deno.env.get('USER_AUTH_KEY')!;
const _OnesignalRestApiKey_ = Deno.env.get('ONESIGNAL_REST_API_KEY')!;
const user_key_provider = {
  getToken() {
    return _OnesignalUserAuthKey_;
  },
};
const app_key_provider = {
  getToken() {
    return _OnesignalRestApiKey_;
  },
};
const configuration = OneSignal.createConfiguration({
  authMethods: {
    user_key: {
      tokenProvider: user_key_provider,
    },
    app_key: {
      tokenProvider: app_key_provider,
    },
  },
});
const onesignalClient = new OneSignal.DefaultApi(configuration);

serve(async req => {
  const {record} = await req.json();

  // 1. Get creator id and story details
  const creator_id = record.creator_id;
  const story_message = record.message;

  let username;
  let friend_ids = [];

  // 2. Query database for creator username and friends
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE') ?? '',
    );

    // Now we can get the session or user object
    const {data: creators, error: creatorError} = await supabaseClient
      .from('profiles')
      .select()
      .eq('id', creator_id);
    username = creators[0].username;
    console.log(username);
    if (creatorError) {
      throw creatorError;
    }

    // And now we can get all friends
    const {data: friendships, error: friendshipsError} = await supabaseClient
      .from('friends')
      .select('sender_id, recipient_id')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${creator_id}, recipient_id.eq.${creator_id}`);
    friend_ids = friendships.map(friendship =>
      friendship.sender_id === creator_id
        ? friendship.recipient_id
        : friendship.sender_id,
    );
    if (friendshipsError) {
      throw friendshipsError;
    }
    console.log(friend_ids);
  } catch (error) {
    return new Response(JSON.stringify({error: error.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 400,
    });
  }

  // 3. Build and sendOneSignal notification object to all friends
  const notification = new OneSignal.Notification();
  notification.app_id = _OnesignalAppId_;
  notification.include_external_user_ids = friend_ids.concat([creator_id]);
  notification.contents = {
    en: `${username} posted a new chip: ${story_message}`,
  };
  const onesignalApiRes = await onesignalClient.createNotification(
    notification,
  );

  return new Response(JSON.stringify({onesignalResponse: onesignalApiRes}), {
    headers: {'Content-Type': 'application/json'},
  });
});
