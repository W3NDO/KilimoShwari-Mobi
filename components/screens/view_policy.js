import { StyleSheet, Button, Alert, KeyboardAvoidingView, Dimensions, Text } from 'react-native';
import React, { useContext, useState, useRef} from 'react';
import Calls from '../services/data';
import AuthContext from '../authProvider';

export function ViewPolicyScreen({navigation}){
    const { getAllPolicies } = useContext(AuthContext);
    return(
        <KeyboardAvoidingView>
            <Text> View Policy Screen </Text>
            
        </KeyboardAvoidingView>
    );
}