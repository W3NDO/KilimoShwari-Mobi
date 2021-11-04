import { StyleSheet, Button, Alert, Image, Dimensions, KeyboardAvoidingView, Text } from 'react-native';
import React, { Component, useContext, useEffect, useState, useRef} from 'react';
import t from 'tcomb-form-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import AuthContext  from '../authProvider';
import { LoginProc  } from './login';
import Calls  from '../services/data';

const call = new Calls();

const Form = t.form.Form

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

const reg_form = t.struct({
    email: t.String,
    password: t.String,
    password_confirmation: t.String
})

const options = {
    fields: {
        email:{
            placeholder: 'Enter Email',
            error: 'Email is Empty'
        },
        password: {
            placeholder: 'Enter Password',
            error: 'Password Required',
            password: true,
            secureTextEntry: true
        },
        password_confirmation: {
            placeholder: 'Confirm Password',
            error: 'Password Required',
            password: true,
            secureTextEntry: true
        }
    }
}

export async function RegisterProc(val){
  if(val.password != val.password_confirmation){
    Alert.alert("password and password confirmation fields need to match");
    return false;
  }
  console.log(val);
  try{
    let res = await call.sign_up(val)
    if (!res){
      throw new Error(res)
    }
    switch (res.status_code) {
      case 200:
        Alert.alert("Registered as user");
        return true;
        break;
      default:
        console.log(res.status_code);
    }
  } catch (e){
    Alert.alert(e.message);
    console.log(e);
  }
}

export function RegisterScreen({navigation, form}){
    const {signUp } = useContext(AuthContext);
    const form_data = useRef();
    const [user, setUser] = useState({
      "email": '',
      "password": ''
    });
    const reg_proc = dets =>{
      const form_val = form_data.current.getValue();
      signUp(form_val);
    }
    return(
      <KeyboardAvoidingView style = {styles.container}>
          <Form
            ref = {form_data}
            type = {reg_form}
            options = {options}
          />
          <Button
            color= "#3D8BCD"
            title = "Register"
            onPress = {reg_proc }/>

          <Text style={styles.cta}> Already have an account? Tap below to Login instead </Text>

          <Button
            color="#DB524C"
            title = "Log in instead"
            onPress = {() => navigation.navigate('Login')}/>

            <Image 
              style={styles.tinyLogo}
              source={require('../images/Logo_Black.png')}
            />
      </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
  cta: {
    textAlign: "center",
    padding: 10,
  },
  tinyLogo: {
    width: screenWidth-65,
    marginTop: 80,
  },
});
