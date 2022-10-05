import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';


// Schedule a generic notifcation for a specific time
export async function scheduleNotification(date: Date, title: string, body: string) {
  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: title,
      body: body,
      android: {
        channelId: 'your-channel-id',
      },
    },
    trigger,
  );
}