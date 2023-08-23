import React, { useState, useEffect } from 'react';
import {View, Text, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import styles from "../../app/styles/component-styling";


const imgDir= FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if(!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true})
    }
};

const CameraButton = () => {
    const selectImage = async  () => {
        let result;
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images});

        if(!result.canceled){
            await saveImage(result.assets[0].uri);
        }
    }
const saveImage = async (uri: string) =>{
        await ensureDirExists();
        const filename = new Date().getTime() +'.jpg';
        const dest = imgDir + filename;
        await FileSystem.copyAsync({from: uri, to: dest});
}
   return (
       <TouchableOpacity style={styles.button} onPress={selectImage}>
           <Text style={styles.buttonText}>Scan ID document</Text>
       </TouchableOpacity>
   )
};

export default CameraButton;