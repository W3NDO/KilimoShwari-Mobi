import {Button, SafeAreaView, StyleSheet, TextInput, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState, useRef} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import GetLocation from 'react-native-get-location'
import AuthContext from '../authProvider';

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

export function BuyPolicyScreen(){
  const { buyPolicy } = useContext(AuthContext); //context

  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(new Date)
  const [endDate, setEndDate] = useState(new Date)
  const [maizeVariety, setMaizeVariety] = useState(null)
  const [coordinates, setCoordinates] = useState([])

  const [varietyTypes, setVarietyTypes] = useState([
    {label: "Hybrid Series 5", value: 'Hybrid Series 5'},
    {label: "Hybrid Series 6", value: 'Hybrid Series 6'}
  ])
  const [openPicker, setOpenPicker] = useState(false)
  const [openStartModal, setOpenStartModal] = useState(false)
  const [openEndModal, setOpenEndModal] = useState(false)

  const _buyPolicy = async data => {
    res = await buyPolicy(data)
    return res
  }

  const locateMe = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      setCoordinates([location["latitude"], location["longitude"]])
      return coordinates
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
  }
    
  return (
      <SafeAreaView>
        <Text>Buy Policy</Text>
        <TextInput 
          style={styles.date}
          placeholder='Enter Your location'
          onChangeText={setLocation}
          value={location}
        />
        <TouchableOpacity onPress={() => setOpenStartModal(true)} >
          <Text style={styles.date}>{startDate == new Date? "Start Date : " + startDate.toLocaleDateString('%b-%d-%Y') : "Set Start Date"}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          title="Select Start Date"
          open={openStartModal}
          date={startDate}
          onConfirm = {
            (date) => {
              setOpenStartModal(false)
              setStartDate(date)
            }
          }
          onCancel={() => {
            setOpenStartModal(false)
          }}
        />
        
        <TouchableOpacity onPress={() => setOpenEndModal(true)} >
          <Text style={styles.date}>{endDate == new Date? "End Date : " + endDate.toLocaleDateString('%b-%d-%Y') : "Set End Date"}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          title="Select End Date"
          open={openEndModal}
          date={endDate}
          onConfirm = {
            (date) => {
              setOpenEndModal(false)
              setEndDate(date)
            }
          }
          onCancel={() => {
            setOpenEndModal(false)
          }}
        />
        <Button
          title="Locate Farm"
          onPress={ () => {
            locateMe()
          }}
        />
        <DropDownPicker
          open={openPicker}
          value={maizeVariety}
          items={varietyTypes}
          setOpen={setOpenPicker}
          setValue={setMaizeVariety}
          setItems={setVarietyTypes}
          placeholder="Select Maize Variety"
        />

        <Button 
          title = "Buy Policy"
          onPress = {async () =>{
            if (location && coordinates && startDate && endDate && maizeVariety){
              console.log("Policy being bought:: ", location, coordinates, Date.parse(startDate), Date.parse(endDate), maizeVariety)
              let _policy_data = {
                "location": location,
                "maize_variety": maizeVariety,
                "start_date": Date.parse(startDate),
                "end_date": Date.parse(endDate)
              }
              let res = await _buyPolicy(_policy_data)
              console.log("policy purchase response", res)
              
            } else {
              console.error("Field Missing")
            }
          }}
        />
        
      </SafeAreaView>
    );
  }


const styles = StyleSheet.create({
  title: {
      fontSize: 20,
      textAlign: "center",

  },
  date: {
      padding: 20,
      color: "#222222",
      borderBottomColor: "#cccccc",
      borderBottomWidth: 1,
      width: screenWidth,
      paddingLeft: 20,
      fontSize: 18,
  }
});