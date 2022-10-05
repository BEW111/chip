import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Text} from 'react-native-paper';

import {selectUid} from '../../redux/authSlice';

import storage from '@react-native-firebase/storage';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function ChipDisplayMini(props) {
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
    <TouchableWithoutFeedback onPress={toggleSelect}>
      <View
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {downloadURL ? (
          <FastImage
            source={{uri: downloadURL}}
            style={{
              height: '99%',
              width: '99%',
              borderWidth: selected ? 3 : 0,
              borderColor: 'pink',
              overflow: 'hidden',
            }}
          />
        ) : (
          <></>
        )}
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>{props.date}</Text>
          <Text style={{color: 'white'}}>{props.time}</Text>
          <Text style={{color: 'white'}}>{props.verb}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
