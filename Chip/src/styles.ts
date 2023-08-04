import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
  fullPadded: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  fullPaddedDark: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#0E1011',
  },
  fullPaddedHorizontal: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  fullDark: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E1011',
  },
  absoluteFull: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  absoluteFullCentered: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  rowSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenteredSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dividerLarge: {
    marginVertical: 18,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dividerHTiny: {
    marginHorizontal: 2,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dividerHSmall: {
    marginHorizontal: 6,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  dividerHMedium: {
    marginHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  widthFull: {
    width: '100%',
  },
  widthAlmostFull: {
    width: '90%',
  },
  textCentered: {
    textAlign: 'center',
  },
  widgetTitle: {
    paddingLeft: 10,
    paddingTop: 4,
    color: 'gray',
    textTransform: 'uppercase',
  },
  noMargin: {
    margin: 0,
  },
});

export const modalStyles = StyleSheet.create({
  wrapper: {
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFECF2',
    shadowOpacity: 0,
    borderRadius: 10,
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
    backgroundColor: '#FFECF2',
  },
  textButtonLabel: {fontSize: 18, marginHorizontal: 0, marginVertical: 6},
});
