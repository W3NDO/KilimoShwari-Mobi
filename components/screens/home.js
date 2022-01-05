import { StyleSheet, Button, Pressable, FlatList, View, Dimensions, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import React, { useContext, useState, useEffect} from 'react';

import AuthContext from '../authProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

const view = ({navigation}) => {  //call the view policy screen for a that specific policy
    try{
        navigation.navigate("Policy")
    } catch(e){
        console.log(e)
    }
}

const Item = ({ title, onPress}) => (
    <TouchableOpacity onPress={onPress} >
      <Text style={styles.policy_item}>{title}</Text>
    </TouchableOpacity>
  );

function renderItem({ item, navigation }){
    let d = new Date(0)
    return(
        <Item
            title={item.id + " : " + item.location + " Farm: " + item.maize_variety }
            // onPress={
            //     () => {
            //         // navigation.navigate("View Policy")
            //         Alert.alert(item.id, item.location, item.maize_variety, item.start_date, item.end_date)
            //     }
            // }
        />
    );
}


export function HomeScreen({navigation}){
    const { getAllPolicies } = useContext(AuthContext);

    const [policies, setPolicies] = useState([]);
    let [refreshCounter, setRefreshCounter] = useState(0)
    const _getPolicies = useEffect (async ()=>{
        setPolicies([])
        res = getAllPolicies()
        num_of_policies = await AsyncStorage.getItem("Policies Total Count")
        for (let i =0; i < num_of_policies; i++){
            let temp = await AsyncStorage.getItem(i.toString())
            setPolicies(policies => [...policies, (JSON.parse(temp))])
        }
    }, [])
    return (
    <SafeAreaView>
        <View style={styles.buttons}>
            <Pressable 
                onPress={ () => {
                    setRefreshCounter(refreshCounter += 1)
                    _getPolicies
                }}
                style={styles.buttonLeft}
            >
                <Text style={styles.text}>Refresh</Text>
            </Pressable>
            <Pressable
                title="Buy Policy"
                onPress={() =>
                    {
                    navigation.navigate('Policy')	
                    }
                }
                style={styles.buttonRight}
            >
                <Text style={styles.text}>Buy Policy</Text>
            </Pressable>
        </View>
        <FlatList
            data={policies}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.policies}
        />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: "center",

    },
    policy_item: {
        padding: 20,
        color: "#222222",
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
        width: screenWidth - 20,
        marginLeft: 10,
        marginRight: 10, 
        paddingLeft: 20,
        fontSize: 16,
    },
    policies: {
        paddingBottom: 50
    },
    text: {
        color: "#ffffff"
    },  
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        width: screenWidth,
        justifyContent: 'center'
    },
    buttonLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: (screenWidth/2)-20,
        marginLeft: 10,
        backgroundColor: '#008700'
    },
    buttonRight: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: (screenWidth/2)-20,
        marginLeft: 10,
        backgroundColor: '#008700'
    }
});
