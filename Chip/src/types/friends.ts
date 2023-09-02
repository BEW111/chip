import {SupabaseProfile} from './profiles';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';
export type RelativeFriendshipStatus =
  | 'none'
  | 'sent'
  | 'received'
  | 'accepted'
  | 'rejected'
  | 'blocked';

export type SupabaseFriendship = {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: string;
};

export type SupabaseBlock = {
  id: string;
  sender_id: string;
  recipient_id: string;
};

// The status is relative to the current user. So if we have another
// profile with the "received" status, that means that we have received
// an invite from them.
export type SupabaseProfileWithFriendship = SupabaseProfile & {
  friendship_id: string | null;
  status: RelativeFriendshipStatus;
};

// This type is used for the payload of a friendship invite
export type FriendshipInvite = {
  sender_id: string;
  recipient_id: string;
};

// These types are just used for the initial results of queries,
// we should try to convert these as soon as possible

// This one is a little weird, but it's because we're joining the profiles
// table to the friendships table based on both keys, so we get lists of
// friendship results ("sent" and "received"). There should really only
// be one item in each list based on our rules.
export type SupabaseProfilesSearchResult = SupabaseProfile & {
  sent: {status: FriendshipStatus; id: string}[];
  received: {status: FriendshipStatus; id: string}[];
  blocked: {created_at: string}[];
};

export type SupabaseReceivedInviteResult = {
  sender: SupabaseProfile;
  id: string;
};

export type SupabaseSentInviteResult = {
  recipient: SupabaseProfile;
  id: string;
};

export type SupabaseFriendshipResult = {
  sender: SupabaseProfile;
  recipient: SupabaseProfile;
  id: string;
};
