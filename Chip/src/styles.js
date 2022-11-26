import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
  absoluteFull: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expand: {
    flex: 1,
  },
});

export const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffddf1',
    width: '90%',
    alignSelf: 'center',
    shadowOpacity: 0,
    borderRadius: 10,
    padding: 18,
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffddf1',
    marginBottom: 24,
  },
  segmentedButtons: {
    width: '100%',
    marginBottom: 24,
  },
});
