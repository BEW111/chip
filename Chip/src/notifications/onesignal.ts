import OneSignal from 'react-native-onesignal';
const ONESIGNAL_APP_ID = '0dd4bbed-4b29-4748-a078-9237265dbf7a';

export async function onLogInOneSignal(uid: string) {
  // OneSignal Initialization
  OneSignal.setAppId(ONESIGNAL_APP_ID);
  OneSignal.setLogLevel(6, 0);

  // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
  OneSignal.promptForPushNotificationsWithUserResponse();

  // Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notificationReceivedEvent,
      );
      let notification = notificationReceivedEvent.getNotification();
      console.log('notification: ', notification);
      const data = notification.additionalData;
      console.log('additionalData: ', data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    },
  );

  // Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
  });

  // Set external user id
  // Setting External User Id with Callback Available in SDK Version 3.9.3+
  OneSignal.setExternalUserId(uid, results => {
    // The results will contain push and email success statuses
    console.log('Results of setting external user id');
    console.log(results);

    // Push can be expected in almost every situation with a success status, but
    // as a pre-caution its good to verify it exists
    if (results.push && results.push.success) {
      console.log('Results of setting external user id push status:');
      console.log(results.push.success);
    }
  });
}

export async function onLogOutOneSignal() {
  OneSignal.removeExternalUserId();
}
