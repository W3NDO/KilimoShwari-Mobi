import { StyleSheet, Button, Alert, KeyboardAvoidingView, Dimensions, Text } from 'react-native';
import React, { useContext, useState, useRef} from 'react';
import Form from 'react-native-form'

export function BuyPolicyScreen(){

  const form_data = useRef();
  const [policy, setPolicy] = useState({
      "location": null,
      "maize_variety": null,
      "start_date": null,
      "end_date": null

  });

  // const buy_policy_proc = () => {
  //     const form_val = form_data.current.getValue();
  //     buyPolicy(form_val);
  // }
    return (
        <KeyboardAvoidingView>
            <Text> Buy Policy </Text>
            <Form ref="form">
              <View>
                <View>
                  <TextInput type="TextInput" name="myTextInput" /> // Yes, it doesn't matter how deep they are :)
                </View>
              </View>

              <Switch type="Switch" name="mySwitch" />
              <Slider type="Slider" name="mySlider" />
              <DatePickerIOS type="DatePickerIOS" name="myBirthday" />
              <Picker type="Picker" name="myPicker" />

              <PickerIOS type="PickerIOS" name="pickers[ios]" /> // Yes, we support form serialization, like the web
            </Form>
        </KeyboardAvoidingView>
    );
}
