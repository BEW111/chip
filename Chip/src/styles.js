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
  centeredExpand: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expand: {
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCentered: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  justifyLeft: {
    justifyContent: 'flex-start',
  },
  dividerTiny: {
    marginVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dividerSmall: {
    marginVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dividerMedium: {
    marginVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  widthFull: {
    width: '100%',
  },
  widthAlmostFull: {
    width: '90%',
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
  labelSmall: {
    fontSize: 18,
  },
  label: {
    fontSize: 24,
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
  },
  textButtonLabel: {fontSize: 18, marginHorizontal: 0, marginVertical: 6},
});
