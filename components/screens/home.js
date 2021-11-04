import { StyleSheet, Button, FlatList, View, Dimensions, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React, { useContext, useState, useRef} from 'react';

//import sample data
import { policies } from '../temp_data/policies';

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

//get all the policies of a particular user
//display all policies of that user
//sort by date? 

function getPolicies(){
    let policy_list = policies()

    return policy_list
}

const DATA = policies();

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
            title={item.alias + " : " + item.Maize_variety}
            onPress={() => {navigation.navigate("View Policy")}}
        />
    );
}
    


export function HomeScreen(){

    return (
    <SafeAreaView>
        <Text style={styles.title}> My Policies </Text>
        <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.alias}
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