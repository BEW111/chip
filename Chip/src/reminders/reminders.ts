import notifee, {
  TimestampTrigger,
  TriggerType,
  AuthorizationStatus,
} from '@notifee/react-native';

export async function requestNotificationsPermission() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Permission settings:', settings);
  } else {
    console.log('User declined permissions');
  }
}

// Schedule a generic notifcation for a specific time
export async function scheduleNotification(
  date: Date,
  title: string,
  intent: string,
) {
  console.log('scheduling notification');

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  const intentMessages = {
    none: 'Reminder',
    remind: 'Just a reminder to stay on track 🏂',
    prepare: 'Prep ahead of time to make it easier later 📚',
    now: 'Get started as soon as you can!',
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: title,
      body: intentMessages[intent],
      android: {
        channelId: 'your-channel-id',
      },
    },
    trigger,
  );

  console.log('notification scheduled');
}

export async function onCreateTriggerNotification(date) {
  const date1 = new Date();
  date1.setHours(10);
  date1.setMinutes(32);

  console.log(date1);

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  // Create a trigger notification
  const scheduleResult = await notifee.createTriggerNotification(
    {
      title: 'Scheduled notification',
      body: 'Today at ______',
      android: {
        channelId: 'your-channel-id',
      },
    },
    trigger,
  );

  console.log(scheduleResult);
}

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
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
