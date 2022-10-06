import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

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
        <View
          style={{
            height: '99%',
            width: '99%',
        }}>
          {downloadURL ? (
            <FastImage
              source={{uri: downloadURL}}
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
              }}
            />
          ) : (
            <></>
          )}
          {selected ? (
            <View 
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(180, 180, 200, 0.2)'
            }}>
              <Icon 
                name="checkmark-circle" 
                size={24}
                style={{
                  position: 'absolute',
                  color: 'rgba(255, 255, 255, 0.8)',
                  bottom: 1,
                  right: 1,
                }}
              />
            </View>
          ) : (
            <></>
          )}
          <Surface style={{
            width: '95%',
            marginTop: 2,
            alignSelf: 'center',
            borderRadius: 5,
            paddingHorizontal: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
            <Text style={{color: 'white', fontWeight: '500'}}>{props.date}, {props.time}</Text>
          </Surface>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
