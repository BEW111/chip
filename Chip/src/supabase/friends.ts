import {supabase} from './supabase';
import {
  FriendshipStatus,
  SupabaseProfileWithStatus,
  SupabaseProfilesSearchResult,
} from '../types/friends';
import {PostgrestError} from '@supabase/supabase-js';

/*
 * Sends a friend request to a particular user
 * TODO: auto-accept if there is already an invite pending
 */
export async function inviteUser(senderId: string, recipientId: string) {
  try {
    const newStatus: FriendshipStatus = 'pending';
    const {error} = await supabase.from('friends').insert({
      sender_id: senderId,
      recipient_id: recipientId,
      status: newStatus,
    });

    if (error) {
      throw Error(error.message);
    }
  } catch (error) {
    console.log(error);
  }
}

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
  // Query where we are the sender
  // Note that we don't need to filter by our involvement, as RLS will
  // take care of this for us
  const {
    data,
    error,
  }: {data: SupabaseProfilesSearchResult[]; error: PostgrestError | null} =
    await supabase
      .from('profiles')
      .select(
        `
      *, 
      received:friends!friends_sender_id_fkey!left(status), 
      sent:friends!friends_recipient_id_fkey!left(status)`,
      )
      .textSearch('username', searchQuery);

  // Here's we're converting from the form of the result data to
  // a much nicer form. The result data may contain either a "received" or "sent"
  // array with an object containing a "status" item. The terms "received" or "sent"
  // refer to whether or not we (the current user) received or sent these friendships.
  // We want to just have one resulting field, which describes the status of the friendship
  // relative to us, so either "accepted", "rejected", "received", "sent", or "none".
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
            : 'none',
      } as SupabaseProfileWithStatus),
  );

  if (error) {
    console.log(error);
    return [];
  }

  return queryResult;
}
