import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { LoginScreen } from './components/screens/login';
import { RegisterScreen,
        RegisterProc } from './components/screens/register';
import { HomeScreen } from './components/screens/home';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthContext from './components/authProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ViewPolicyScreen } from './components/screens/view_policy';
import { BuyPolicyScreen } from './components/screens/buy_policy';
import Calls from './components/services/data';

const call = new Calls;
const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const PolicyStack = createStackNavigator();

//The primary stack screen called when you log in to the app
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name='Home' component = {HomeScreen} />
    <HomeScreen.Screen name='View Policy' component={ViewPolicyScreen} />
  </HomeStack.Navigator>
);

const PolicyStackScreen = () => (
  <PolicyStack.Navigator>
    <PolicyStack.Screen name='New Policy' component={BuyPolicyScreen}/>
  </PolicyStack.Navigator>
);

console.log(call.get_headers())
const LoginProc = async val => {
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

const getAllPolicies = async () => {
  let _policies = null;
  try{
    let res = await call.getPolicies();
    if (!res){
      throw new Error(res)
    } else {
      switch(res.status_code){
        case 200:
            _policies= res.data.data.policies;
            for (let i=0; i < _policies.length; i++){
              AsyncStorage.setItem(i.toString(), JSON.stringify(_policies[i]));
            }
            AsyncStorage.setItem("Policies Total Count", _policies.length.toString())
            return true, _policies;
        case 401:
            Alert.alert("Unauthorized");
            console.log("Un-auth: Getting policies");
            return false;
        default:
            Alert.alert("There seems to be an error.");
            return false;
      }
    }
  } catch (e) {
    console.log("Failed to get all policies", e)
    return false;
  }
}

const BuyPolicy = async data => {
  try{
    let res = await call.buyPolicy(data)
    if (!res){
      throw new Error(res)
    } else {
      switch(res.status_code){
        case 200:
            _policies= res.data.data.policies;
            _blockhash = res.data.data[0].blockHash
            _policy_id = res.data.data[1].id
            return true, _blockhash, _policy_id;
        case 401:
            Alert.alert("Unauthorized");
            console.log("Un-auth: Getting policies");
            return false;
        default:
            Alert.alert("There seems to be an error.");
            return false;
      }
    }
  } catch(e){
    console.log(e)
  }
}


export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userEmail: action.email,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userEmail: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("authToken");
      } catch (e) {
        console.log(e)
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      signIn: async data => {
        let authToken;
        console.log('Here')
        try{
          console.log(data);
          let res = await LoginProc(data)
          console.log('Res', res);
          res[0] ? authToken = res[1] : authToken = null;

        } catch (e){
          console.log(e)
        }
        let _email = await AsyncStorage.getItem('email');
        dispatch({ type: 'SIGN_IN', token: authToken , email: _email });
      },

      signOut: () => {
        signOutProc();
        dispatch({ type: 'SIGN_OUT' })
      },

      signUp: async data => {
        let authToken;
        try{
          let res = await RegisterProc(data)
        } catch (e){
          console.log(e);
        }
        dispatch({ type: 'SIGN_IN', token: authToken  });
      },

      getAllPolicies: async token => {
        let _policies;
        try {
          let res = await getAllPolicies(token);
          _policies = res[1]
          return _policies;
        } catch (e) {
          console.log( "Failed to get policies: ", e)
        }
      },

      buyPolicy: async data => {
        let _bought;
        try{
          let res = await BuyPolicy(data);
          if (res[0]){
            _bought = res[0];
            return res[0], res[1], res[2]
          } else {
            _bought = res[0]
          }
        } catch (e){
          console.error("Couldn't buy the policy ", e)
        }
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <NavigationContainer>
        {console.log(state.userToken, call.get_headers())}
        {state.userToken ? call.update_headers({"token": state.userToken}) : null}
        {state.userToken==null?
          (
          <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={LoginScreen} />
            <AuthStack.Screen name='Register' component={RegisterScreen} />
          </AuthStack.Navigator>
        ): (
          <Tabs.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: '#008700',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tabs.Screen name='Home' component={HomeScreen}/>
            <Tabs.Screen
              name='Policy'
              options = {{headerShown : false}}
              component={PolicyStackScreen}
              />
          </Tabs.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
