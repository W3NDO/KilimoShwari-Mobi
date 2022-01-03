import { StyleSheet, Button, FlatList, View, Dimensions, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import React, { useContext, useState, useEffect} from 'react';

import AuthContext from '../authProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

//get all the policies of a particular user
//display all policies of that user
//sort by date? 

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
            title={item.id + " : " + item.location + " : " + item.maize_variety }
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
    useEffect (async ()=>{
        res = getAllPolicies()
        num_of_policies = await AsyncStorage.getItem("Policies Total Count")
        for (let i =0; i < num_of_policies; i++){
            temp = await AsyncStorage.getItem(i.toString())
            setPolicies([...policies, JSON.parse(temp)])
            
        }      
    }, [refreshCounter])
    return (
    <SafeAreaView>
        <Text style={styles.title}> My_Policies </Text>
        <Button 
            title='Refresh'
            onPress={ () => {setRefreshCounter( refreshCounter += 1)} }
        />
        <FlatList
        data={policies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        />
        <Button 
                title = "Buy New Policy"
                onPress={ () => navigation.navigate('New Policy')}
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
        width: screenWidth,
        paddingLeft: 20,
        fontSize: 18,
    }
});