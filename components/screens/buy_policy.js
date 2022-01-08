import {Pressable, SafeAreaView, StyleSheet, TextInput, Dimensions, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useContext, useState, useRef} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import GetLocation from 'react-native-get-location'
import AuthContext from '../authProvider';

//screen dimensions
const screenWidth = Math.round(Dimensions.get('screen').width);
const screenHeight = Math.round(Dimensions.get('screen').height);

export function BuyPolicyScreen({navigation}){
  const { buyPolicy } = useContext(AuthContext); //context

  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState(new Date)
  const [endDate, setEndDate] = useState(new Date)
  const [maizeVariety, setMaizeVariety] = useState(null)
  const [coordinates, setCoordinates] = useState('')

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
      console.log(location["latitude"].toString() + ',' + location["longitude"].toString())
      setCoordinates(location["latitude"].toString() + ',' + location["longitude"].toString())
      return coordinates
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
  }
    
  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Location</Text>
        <TextInput 
          style={styles.location}
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

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.locateButton}
            onPress={ () => {
              locateMe()
            }}
          >
            <Text> Locate Farm</Text>
          </Pressable>
        </View>
        <DropDownPicker
          style={styles.picker}
          open={openPicker}
          value={maizeVariety}
          items={varietyTypes}
          setOpen={setOpenPicker}
          setValue={setMaizeVariety}
          setItems={setVarietyTypes}
          placeholder="Select Maize Variety"
        />
        <View style={styles.buttonContainer}> 
          <Pressable 
            style={styles.buyButton}
            onPress = {async () =>{
              console.log("COORDS && TIMES : ",coordinates , startDate.getTime()/1000, endDate)
              if (location && coordinates && startDate && endDate && maizeVariety){
                let _policy_data = {
                  "location": location,
                  "maize_variety": maizeVariety,
                  "coordinates": coordinates,
                  "start_date": startDate,
                  "end_date": endDate
                }
                let res = await _buyPolicy(_policy_data)
                if (res[0]){
                  Alert.alert("Successfully purchased a new Policy");
                  navigation.navigate("Home")
                }
                console.log("policy purchase response", res)
                
              } else {
                console.error("Field Missing")
              }
            }}
          >
            <Text>Buy Policy</Text>
          </Pressable>
        </View>
        
      </SafeAreaView>
    );
  }


const styles = StyleSheet.create({
  title: {
    paddingBottom: 0,
    paddingTop: 20,
    color: "#222222",
    width: screenWidth,
    paddingLeft: 20,
    fontSize: 14,

  },
  date: {
      padding: 20,
      color: "#222222",
      borderBottomColor: "#cccccc",
      borderBottomWidth: 1,
      width: screenWidth - 20,
      marginLeft: 10,
      marginRight: 10, 
      paddingLeft: 20,
      fontSize: 18,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },  
  location: {
    borderColor: "#222222",
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: screenWidth -20,
  },
  locateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: (screenWidth/2) -20,
    marginLeft: 10,
    backgroundColor: '#008700',
    marginBottom: 10,
    marginTop: 10,
  },
  buyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: (screenWidth/2) -20,
    marginLeft: 10,
    backgroundColor: '#008700',
    position: "relative",
    marginTop: 100,
    bottom: 0,
  },
  container: {
    height: screenHeight,
  }
});