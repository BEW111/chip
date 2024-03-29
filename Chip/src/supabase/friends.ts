import {supabase} from './supabase';
import {
  FriendshipStatus,
  SupabaseProfileWithFriendship,
  SupabaseProfilesSearchResult,
} from '../types/friends';
import {PostgrestError} from '@supabase/supabase-js';

/**
 * Accepts an invite
 */
export async function acceptInvite(senderId: string, recipientId: string) {
  try {
    const newStatus: FriendshipStatus = 'accepted';
    const {error} = await supabase
      .from('friends')
      .update({
        status: newStatus,
      })
      .eq('sender_id', senderId)
      .eq('recipient_id', recipientId);

    if (error) {
      console.log(error);
      throw Error(error.message);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Rejects an invite
 */
export async function rejectInvite(senderId: string, recipientId: string) {
  try {
    const newStatus: FriendshipStatus = 'rejected';
    const {error} = await supabase
      .from('friends')
      .update({
        status: newStatus,
      })
      .eq('sender_id', senderId)
      .eq('recipient_id', recipientId);

    if (error) {
      throw Error(error.message);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param searchQuery
 * @param uid: the current user's id
 * @returns All profiles along with friendship statuses
 */
export async function getProfilesBySearchQuery(searchQuery: string) {
  // Note that we don't need to filter by our involvement, as RLS will take care of this.
  // We're getting all profiles, and then joining those profiles with friends data on
  // whether or not the user matches a sender_id or a recipient_id.
  // Thus, if there is a "received" entry, then this user is involved in a friendship
  // where THEY are the recipient.
  const {
    data,
    error,
  }: {data: SupabaseProfilesSearchResult[]; error: PostgrestError | null} =
    await supabase
      .from('profiles')
      /*
       * received: the profile we have found MATCHES with received, so this is a friend request WE sent
       * sent: the profile we have found MATCHES with sent, so this is a friend request WE received
       */
      .select(
        `
      *, 
      received:friends!friends_sender_id_fkey!left(status, id),
      sent:friends!friends_recipient_id_fkey!left(status, id),
      blocked:blocks!blocks_recipient_id_fkey!left(created_at)`,
      )
      .like('username', `${searchQuery}%`)
      .order('username')
      .limit(20);

  // Here's we're converting from the form of the result data to
  // a much nicer form. The result data may contain either a "received" or "sent"
  // array with an object containing a "status" item. The terms "received" or "sent"
  // refer to which foreign key the OTHER user matched with. Therefore, if the OTHER user
  // has a "recieved" entry, we are the sender, so we want to flip these terms so they're more intuitive.
  // We want to just have one resulting field, which describes the status of the friendship
  // relative to us, so either "accepted", "rejected", "received", "sent", or "none".

  // We've also modified this to mark the user as "blocked" if relevant
  const queryResult = data.map(
    searchResult =>
      ({
        ...searchResult,
        status:
          searchResult.sent.length > 0
            ? searchResult.sent[0].status === 'pending'
              ? 'sent'
              : searchResult.sent[0].status
            : searchResult.received.length > 0
            ? searchResult.received[0].status === 'pending'
              ? 'received'
              : searchResult.received[0].status
            : searchResult.blocked.length > 0
            ? 'blocked'
            : 'none',
        friendship_id:
          searchResult.sent.length > 0
            ? searchResult.sent[0].id
            : searchResult.received.length > 0
            ? searchResult.received[0].id
            : null,
      } as SupabaseProfileWithFriendship),
  );

  if (error) {
    console.log(error);
    return [];
  }

  return queryResult;
}
