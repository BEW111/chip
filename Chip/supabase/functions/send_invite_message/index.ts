// Used for messages related to sending/accepting requests between users

// `sender_id` and `recipient_id` are a bit confusing here, as they refer to the
// original sender/recipient of the request. This means that if the event type is
// a user accepting a request, then we should send a notification to the user `sender_id`,
// since they were the one who originally sent the friend request.

// We use `notification_recipient_id` to keept track of the actual intended notification recipient.

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
  const {record, old_record} = await req.json();
  const url = new URL(req.url);

  // 1. Get sender, recipient, and message type details
  const sender_id = record.sender_id;
  const recipient_id = record.recipient_id;
  const message_type = url.searchParams.get('message_type');

  // 2. Validate event type
  if (
    message_type === 'friend_request_accepted' ||
    message_type === 'costreak_request_accepted'
  ) {
    if (old_record.status !== 'pending' && record.status !== 'accepted') {
      return;
    }
  }

  // 3. Query database for creator username and friends
  let sender_username;
  let recipient_username;

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE') ?? '',
    );

    // Now we can get the session or user object
    const {data: senderArray, error: senderProfileError} = await supabaseClient
      .from('profiles')
      .select()
      .eq('id', sender_id);
    sender_username = senderArray[0].username;
    if (senderProfileError) {
      throw senderProfileError;
    }

    const {data: recipientArray, error: recipientProfileError} =
      await supabaseClient.from('profiles').select().eq('id', recipient_id);
    recipient_username = recipientArray[0].username;
    if (recipientProfileError) {
      throw recipientProfileError;
    }
  } catch (error) {
    return new Response(JSON.stringify({error: error.message}), {
      headers: {'Content-Type': 'application/json'},
      status: 400,
    });
  }

  // 4. Create notification message
  console.log(message_type);
  const notification_message =
    message_type === 'friend_request_sent'
      ? `${sender_username} sent you a friend request`
      : message_type === 'friend_request_accepted'
      ? `${recipient_username} accepted your friend request`
      : message_type === 'costreak_request_sent'
      ? `${sender_username} wants to start a superstreak with you`
      : message_type === 'costreak_request_accepted'
      ? `${recipient_username} accepted your superstreak request`
      : null;

  if (notification_message === null) {
    return;
  }

  // 5. Build and sendOneSignal notification object to all friends
  let notification_recipient;

  if (
    message_type === 'friend_request_accepted' ||
    message_type === 'costreak_request_accepted'
  ) {
    notification_recipient = sender_id;
  } else {
    notification_recipient = recipient_id;
  }

  const notification = new OneSignal.Notification();
  notification.app_id = _OnesignalAppId_;
  notification.include_external_user_ids = [notification_recipient];
  notification.contents = {
    en: notification_message,
  };
  const onesignalApiRes = await onesignalClient.createNotification(
    notification,
  );

  return new Response(JSON.stringify({onesignalResponse: onesignalApiRes}), {
    headers: {'Content-Type': 'application/json'},
  });
});
