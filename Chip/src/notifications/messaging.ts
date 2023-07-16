import messaging from '@react-native-firebase/messaging';

// Note that an async function or a function that returns a Promise
// is required for both subscribers.
async function onMessageReceived(message) {
  // Do something
  console.log('Received message: ' + message);
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

export async function onAppBootstrapFCM() {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  // Save the token
  await postToApi('/users/1234/tokens', {token});
}
