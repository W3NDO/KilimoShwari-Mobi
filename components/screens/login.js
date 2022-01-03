import { StyleSheet, Button, Alert, KeyboardAvoidingView, Dimensions, Text, Image, Async } from 'react-native';
import React, { useContext, useState, useRef} from 'react';
import t from 'tcomb-form-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import AuthContext from '../authProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Calls  from '../services/data';

//for any calls to the backend server
const call = new Calls();

//for the form
const Form = t.form.Form

const login_form = t.struct({
    email: t.String,
    password: t.String
})

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

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
        }
    }
}

export async function LoginProc(val){
  try{
      let res = await call.login(val);
      if (!res){
          throw new Error(res)
      }
      switch(res.status_code){
        case 200:
            let authToken = res.data.token;
            AsyncStorage.setItem("authToken", String(authToken));
            AsyncStorage.setItem("email", val.email)
            console.log('mail', val.email);
            return true, authToken;
        case 401:
            Alert.alert("Log in Failure");
            console.log("Wrong Password & email combo");
            return false;
        default:
            Alert.alert("There seems to be an error. Error Code: ", res.status_code);
            return false;
      }
  } catch (e){
      Alert.alert(e.message);
      console.log(e.message);
  }
}

export function LoginScreen({navigation, form}){
    const [token, setToken] = useState(null);
    const { signIn } = useContext(AuthContext);

    const form_data = useRef();
    const [user, setUser] = useState({
        "email": '',
        "password": ''
    });

    const login_proc = () => {
        const form_val = form_data.current.getValue();
        signIn(form_val);
    }

    return(
        <KeyboardAvoidingView style = {styles.container}>

            <Form
                ref = {form_data}
                type = {login_form}
                options = {options}
            />
            <Button
                color= "#3D8BCD"
                title = "Log In"
                onPress = {login_proc }/>

            <Text style={styles.cta}> Don't have an account yet? Tap below to register </Text>

            <Button
                color="#DB524C"
                title = "Sign Up"
                onPress = {() => navigation.navigate('Register')}/>

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
		width: screenWidth - 25,
	},

    cta: {
        textAlign: "center",
        padding: 10,
    },
    tinyLogo: {
        width: screenWidth-65,
        marginTop: 150,
    }

});
