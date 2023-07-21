import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Note that an async function or a function that returns a Promise
// is required for both subscribers.
async function onMessageReceived(message) {
  // Do something
  console.log('Received message: ' + message);
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

export async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Story posted!',
    body: 'Main body content of the notification',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
