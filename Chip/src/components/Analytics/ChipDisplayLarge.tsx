import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Text, Surface} from 'react-native-paper';

import {selectUid} from '../../redux/authSlice';

import storage from '@react-native-firebase/storage';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function ChipDisplayLarge(props) {
  const uid = useSelector(selectUid);
  const path = `user/${uid}/chip-photo/${props.photo}`;
  const [downloadURL, setDownloadURL] = useState('');
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    async function grabURL() {
      const newURL = await storage().ref(path).getDownloadURL();
      setDownloadURL(newURL);
    }
    grabURL();
  }, [path]);

  const toggleSelect = () => {
    setSelected(!selected);
  };

  return (
    <Surface
      style={{
        height: '80%',
        width: '95%',
        display: 'flex',

        backgroundColor: 'white',
        borderRadius: 5,
        top: 10,
      }}>
      <Text
        style={{
          color: 'black',
          marginTop: 7,
          fontSize: 24,
          alignSelf: 'center',
        }}>
        {props.verb}
      </Text>
      <View
        style={{

          flexGrow: 1,
          flexBasis: 0,
          display: 'flex',
          flexDirection: 'row',
        }}>
        <View
          style={{
            height: '100%',
            aspectRatio: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {downloadURL ? (
            <FastImage
              source={{uri: downloadURL}}
              style={{
                height: '90%',
                aspectRatio: 1,
                overflow: 'hidden',
                borderRadius: 5,
              }}
            />
          ) : (
            <View style={{height: '90%', aspectRatio: 1, borderRadius: 5, backgroundColor: 'gray'}} />
          )}
        </View>
        <Text style={{color: 'black', marginTop: 10, fontSize: 16}}>
          {props.date + '\n' + props.time}
        </Text>
      </View>
    </Surface>
  );
}