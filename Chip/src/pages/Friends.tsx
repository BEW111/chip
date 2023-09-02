import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Keyboard,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {styles} from '../styles';
import {useAppDispatch, useAppSelector} from '../redux/hooks';

// Components
import {TextInput, Divider, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import UserContainer from '../components/Users/UserContainer';

// Friends
import {
  useGetFriendsQuery,
  useGetSentFriendRequestsQuery,
  useGetReceivedFriendRequestsQuery,
} from '../redux/slices/friendsSlice';
import {getProfilesBySearchQuery} from '../supabase/friends';
import {SupabaseProfileWithFriendship} from '../types/friends';

// Profiles
import {selectUid} from '../redux/slices/authSlice';
import supabaseApi from '../redux/supabaseApi';

export default function Friends() {
  const theme = useTheme();

  // Search bar
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [searchBarEditing, setSearchBarFocused] = useState(false);
  const [searchResultProfiles, setSearchResultProfiles] = useState<
    SupabaseProfileWithFriendship[]
  >([]);
  const onClearTextSearch = () => {
    setCurrentSearchQuery('');
    setSearchResultProfiles([]);
  };

  const uid = useAppSelector(selectUid);

  // Friends
  const {data: received, refetch: refetchReceived} =
    useGetReceivedFriendRequestsQuery();
  const {data: sent, refetch: refetchSent} = useGetSentFriendRequestsQuery();
  const {data: friends, refetch: refetchFriends} = useGetFriendsQuery();

  const onSearch = async (searchQuery: string) => {
    if (searchQuery) {
      setCurrentSearchQuery(searchQuery);
      if (uid) {
        const profileResults = await getProfilesBySearchQuery(searchQuery);
        setSearchResultProfiles(profileResults);
      }
    } else {
      setCurrentSearchQuery('');
      setSearchResultProfiles([]);
    }
  };

  // Refresh controls
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    dispatch(supabaseApi.util.invalidateTags(['Goal', 'Costreak']));
    await refetchReceived();
    await refetchSent();
    await refetchFriends();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, [dispatch, refetchReceived, refetchSent, refetchFriends]);

  return (
    <Pressable style={styles.full} onPress={() => Keyboard.dismiss()}>
      <View style={styles.fullDark}>
        <SafeAreaView>
          <View style={styles.fullPaddedDark}>
            <FocusAwareStatusBar animated={true} barStyle="light-content" />
            <TextInput
              label="Search for users"
              value={currentSearchQuery}
              onChangeText={text => onSearch(text)}
              onFocus={() => setSearchBarFocused(true)}
              onEndEditing={() => setSearchBarFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              style={{backgroundColor: theme.colors.backgroundDark}}
              contentStyle={localStyles.whiteText}
              left={<TextInput.Icon icon="search-outline" />}
              right={
                <TextInput.Icon
                  icon="close-outline"
                  onPress={onClearTextSearch}
                />
              }
            />
            <ScrollView
              alwaysBounceVertical={true}
              keyboardShouldPersistTaps="always"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.onPrimary}
                  colors={[theme.colors.onPrimary]}
                />
              }
              contentContainerStyle={localStyles.profileContainer}>
              <Pressable
                disabled={searchBarEditing}
                style={localStyles.profileContainer}>
                <Divider style={styles.dividerSmall} />
                {searchResultProfiles.map(profile => (
                  <View key={profile.id}>
                    <UserContainer user={profile} />
                    <Divider style={styles.dividerSmall} />
                  </View>
                ))}
                <Divider style={styles.dividerSmall} />
                <Text variant="labelLarge" style={localStyles.whiteText}>
                  Friend requests
                </Text>
                <Divider style={styles.dividerTiny} />
                {received &&
                  received.map(user => (
                    <View key={user.id}>
                      <UserContainer user={user} />
                      <Divider style={styles.dividerSmall} />
                    </View>
                  ))}
                {sent &&
                  sent.map(user => (
                    <View key={user.id}>
                      <UserContainer user={user} />
                      <Divider style={styles.dividerSmall} />
                    </View>
                  ))}
                <Divider style={styles.dividerSmall} />
                <Text variant="labelLarge" style={localStyles.whiteText}>
                  Friends
                </Text>
                <Divider style={styles.dividerTiny} />
                {friends &&
                  friends.map(user => (
                    <View key={user.id}>
                      <UserContainer user={user} />
                      <Divider style={styles.dividerSmall} />
                    </View>
                  ))}
              </Pressable>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  profileContainer: {flexGrow: 1},
  whiteText: {color: 'white'},
});
