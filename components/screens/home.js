import { StyleSheet, Button, Alert, View, Dimensions, Text } from 'react-native';
import React, { useContext, useState, useRef} from 'react';

//import sample data
import { policies } from '../temp_data/policies';


//get all the policies of a particular user
//display all policies of that user
//sort by date? 

function getPolicies(){
    let policy_list = policies()

    return policy_list
}

export function HomeScreen(){
    return (
        <View>

        </View>
    );
}