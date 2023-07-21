import {SupabaseProfile} from './profiles';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';
export type RelativeFriendshipStatus =
  | 'none'
  | 'sent'
  | 'received'
  | 'accepted'
  | 'rejected';

export type SupabaseFriendship = {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: string;
};

// The status is relative to the current user. So if we have another
// profile with the "received" status, that means that we have received
// an invite from them.
export type SupabaseProfileWithStatus = SupabaseProfile & {
  status: RelativeFriendshipStatus;
};

export type SupabaseProfileWithFriendship = SupabaseProfile & {
  friend: SupabaseFriendship;
};

// These types are just used for the initial results of queries,
// we should try to convert these as soon as possible

// This one is a little weird, but it's because we're joining the profiles
// table to the friendships table based on both keys, so we get lists of
// friendship results ("sent" and "received"). There should really only
// be one item in each list based on our rules.
export type SupabaseProfilesSearchResult = SupabaseProfile & {
  sent: {status: FriendshipStatus}[];
  received: {status: FriendshipStatus}[];
};

export type SupabaseReceivedInviteResult = {
  sender: SupabaseProfile;
};

export type SupabaseSentInviteResult = {
  recipient: SupabaseProfile;
};

export type SupabaseFriendshipResult = {
  sender: SupabaseProfile;
  recipient: SupabaseProfile;
};
