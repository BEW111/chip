import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {Button, IconButton, Modal, Portal} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  scheduleNotification,
  onDisplayNotification,
  onCreateTriggerNotification,
  requestNotificationsPermission,
} from '../utils/notifcations';

export default function Social() {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    alignSelf: 'center',
  };

  return (
    <SafeAreaView>
      <View
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <Text>.</Text>

            <Button
              icon="notifications"
              mode="contained"
              onPress={() => {
                var soon = new Date();
                soon.setSeconds(soon.getSeconds() + 10);
                console.log(soon.toDateString());

                scheduleNotification(
                  soon,
                  'Prep for workout',
                  'Set your clothes out for the gym tomorrow',
                );
              }}>
              Schedule notifcation
            </Button>
          </Modal>
        </Portal>
        <Button mode="contained" style={{marginTop: 30}} onPress={showModal}>
          Set reminder
        </Button>
      </View>
    </SafeAreaView>
  );
}
