import React, {useState} from 'react';
import {View, ScrollView, Pressable, Keyboard, StyleSheet} from 'react-native';
import {styles} from '../styles';
import {useAppSelector} from '../redux/hooks';

// Components
import {TextInput, Divider, Text} from 'react-native-paper';
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
  // Search bar
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [searchResultProfiles, setSearchResultProfiles] = useState<
    SupabaseProfileWithStatus[]
  >([]);

  const uid = useAppSelector(selectUid);

  // Friends
  const {data: received} = useGetReceivedFriendRequestsQuery();
  const {data: sent} = useGetSentFriendRequestsQuery();
  const {data: friends} = useGetFriendsQuery();

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

  return (
    <Pressable style={styles.expand} onPress={() => Keyboard.dismiss()}>
      <View style={styles.fullPaddedDark}>
        <FocusAwareStatusBar animated={true} barStyle="light-content" />
        <SafeAreaView>
          <ScrollView
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled">
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
        </SafeAreaView>
      </View>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  whiteText: {color: 'white'},
  textInput: {backgroundColor: '#222'},
});
