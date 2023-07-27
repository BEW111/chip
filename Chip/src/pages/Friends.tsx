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
import {useAppSelector} from '../redux/hooks';

// Components
import {TextInput, Divider, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import UserContainer from '../components/Friends/UserContainer';

// Friends
import {
  useGetFriendsQuery,
  useGetSentFriendRequestsQuery,
  useGetReceivedFriendRequestsQuery,
} from '../redux/supabaseApi';
import {getProfilesBySearchQuery} from '../supabase/friends';
import {SupabaseProfileWithStatus} from '../types/friends';

// Profiles
import {selectUid} from '../redux/slices/authSlice';

export default function Friends() {
  const theme = useTheme();

  // Search bar
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [searchResultProfiles, setSearchResultProfiles] = useState<
    SupabaseProfileWithStatus[]
  >([]);

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
        console.log(profileResults);
        setSearchResultProfiles(profileResults);
      }
    } else {
      setCurrentSearchQuery('');
      setSearchResultProfiles([]);
    }
  };

  // Refresh controls
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchReceived();
    await refetchSent();
    await refetchFriends();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, [refetchReceived, refetchSent, refetchFriends]);

  return (
    <Pressable style={styles.expand} onPress={() => Keyboard.dismiss()}>
      <View style={styles.fullDark}>
        <SafeAreaView>
          <View style={styles.fullPaddedDark}>
            <FocusAwareStatusBar animated={true} barStyle="light-content" />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              label="Search for users"
              value={currentSearchQuery}
              onChangeText={text => onSearch(text)}
              style={localStyles.textInput}
              contentStyle={localStyles.whiteText}
              left={<TextInput.Icon icon="search-outline" />}
              right={
                <TextInput.Icon
                  icon="close-outline"
                  onPress={() => setCurrentSearchQuery('')}
                />
              }
            />
            <ScrollView
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps="handled"
              // style={{backgroundColor: 'red'}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.onPrimary}
                  colors={[theme.colors.onBackground]}
                />
              }>
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
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  whiteText: {color: 'white'},
  textInput: {backgroundColor: '#222'},
});
