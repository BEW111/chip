import React from 'react';
import {styles} from '../../styles';

import {Dimensions, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import Pdf from 'react-native-pdf';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const EulaReader = ({onCloseReader}) => {
  // PDF
  const pdfSource = {
    uri: 'https://qsqweweesjdcztnhowwj.supabase.co/storage/v1/object/public/eula/Chip%20EULA.pdf',
    cache: true,
  };

  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={styles.absoluteFull}>
        <View style={localStyles.pdfContainer}>
          <Pdf
            source={pdfSource}
            fitPolicy={0}
            onLoadComplete={(numberOfPages: number, filePath: string) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page: number, numberOfPages: number) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={localStyles.pdf}
          />
        </View>
      </View>
      <View style={styles.absoluteFull} pointerEvents="box-none">
        <IconButton
          icon={'close-outline'}
          onPress={onCloseReader}
          size={32}
          style={[localStyles.closeIcon, {top: insets.top}]}
        />
      </View>
    </>
  );
};

export default EulaReader;

const localStyles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  container: {
    height: '100%',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  closeIcon: {
    right: 10,
    top: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
  },
});
