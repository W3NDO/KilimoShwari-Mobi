import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen ,
        LoginProc } from './components/screens/login';
import { RegisterScreen,
        RegisterProc } from './components/screens/register';
import { HomeScreen } from './components/screens/home';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthContext from './components/authProvider';


const AuthStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name='Home' component = {HomeScreen} />
  </HomeStack.Navigator>
);


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
    }),
    []
  );
  return (
    <AuthContext.Provider value={contextValue}>
      <NavigationContainer>
        {state.userToken==null? 
          (
          <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={LoginScreen} />
            <AuthStack.Screen name='Register' component={RegisterScreen} />
          </AuthStack.Navigator>
        ): (
          <Tabs.Navigator>
            <Tabs.Screen name='Home' component={HomeStackScreen}/>
          </Tabs.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
