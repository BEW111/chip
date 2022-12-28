import React, {useState, useCallback} from 'react';
import {Keyboard, Pressable, View} from 'react-native';
import {Divider, TextInput, Menu, IconButton} from 'react-native-paper';

const useComponentSize = () => {
  const [size, setSize] = useState({width: 0, height: 0});

  const onLayout = useCallback(event => {
    const {width, height} = event.nativeEvent.layout;
    setSize({width, height});
  }, []);

  return [size, onLayout];
};

// type MenuItem

function InputFieldMenu({items, onSelectedChange, ...props}) {
  const [selectedItem, setSelectedItem] = useState(
    items.length > 0 ? items[0] : null,
  );
  const [text, setText] = useState(selectedItem ? selectedItem.title : '');
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [size, onLayout] = useComponentSize();

  return (
    <View style={{...props.style}} onLayout={onLayout}>
      <View style={{flexDirection: 'row-reverse'}}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={{width: size.width}}
          contentStyle={{width: size.width}}
          anchor={<IconButton iconColor="rgba(0, 0, 0, 0)" />}
          anchorPosition="bottom">
          {items.map(item => (
            <Menu.Item
              onPress={() => {
                setSelectedItem(item);
                onSelectedChange(item);
                setText(item.title);
                Keyboard.dismiss();
                closeMenu();
              }}
              key={item.value + item.title}
              title={item.title}
            />
          ))}
        </Menu>
      </View>
      <TextInput
        value={text}
        onChangeText={text => setText(text)}
        editable={false}
        style={{position: 'absolute', width: '100%'}}
        right={
          <TextInput.Icon
            icon={visible ? 'caret-up-outline' : 'caret-down-outline'}
            size={18}
            onPress={openMenu}
          />
        }
      />
    </View>
  );
}

export default InputFieldMenu;
