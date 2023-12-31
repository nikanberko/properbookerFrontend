import {Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import InputScrollView from "react-native-input-scroll-view";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import base64js from "base64-js"
import * as Sharing from "expo-sharing"
import styles from "../styles/component-styling";
import * as ImagePicker from "expo-image-picker";
import {useAuth} from "../context/AuthContext";
import {retrieveToken} from "../utils/retireveToken";
import {baseUrl, googleVisionApiKey, googleVisionUrl} from "../utils/apiUrls";

const imgDir= FileSystem.documentDirectory + 'images/';
const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if(!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true})
    }
};

const AddGuests = ({route}) => {
    const { apartmentName } = route.params
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [documentIdNumber, setDocumentIdNumber] = useState("");
    const [issuer, setIssuer] = useState("");
    const [gender, setGender] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [guestName, setGuestName] = useState("");
    const [guestLastName, setGuestLastName] = useState("");
    const [address, setAddress] = useState("");
    const [idNumberError, setIdNumberError] = useState("");
    const [documentIdNumberError, setDocumentIdNumberError] = useState("");
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
    const [showCheckInDatePicker, setShowCheckInDatePicker] = useState(false);
    const [showCheckOutDatePicker, setShowCheckOutDatePicker] = useState(false);

    const selectImage = async  () : Promise<string> => {
        let result;
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images});

        if(!result.canceled){
            return await saveImage(result.assets[0].uri);
        }
    }
    const saveImage = async (uri: string) : Promise<string> =>{
        await ensureDirExists();
        const filename = new Date().getTime() +'.jpg';
        const dest = imgDir + filename;
        await FileSystem.copyAsync({from: uri, to: dest});

        const imageData = await FileSystem.readAsStringAsync(dest, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return imageData;
    }

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = now.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setCurrentDateTime(formattedDateTime);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    const validateIds = (text) => {
        return /^\d+$/.test(text);
    };


    const handleIdNumberChange = (text) => {
        if (!validateIds(text)) {
            setIdNumberError("Please enter a valid guest id number");
        } else {
            setIdNumberError("");
        }
        setIdNumber(text);
    };

    const handleDocumentIdNumberChange = (text) => {
        if (!validateIds(text)) {
            setDocumentIdNumberError("Please enter a valid document id number");
        } else {
            setDocumentIdNumberError("");
        }
        setDocumentIdNumber(text);
    };

    const handleIssuerChange = (text) => {
        setIssuer(text);
    };
    const handleCitizenshipChange = (text) => {
        setCitizenship(text);
    };

    const handleGuestNameChange = (text) => {
        setGuestName(text);
    };

    const handleGuestLastNameChange = (text) => {
        setGuestLastName(text);
    };


    const handleGenderChange = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleOrganizationTypeChange = (selectedOrganizationType) => {
        setOrganizationType(selectedOrganizationType);
    };


    const handleAddressChange = (text) => {
        setAddress(text);
    };

    const handleDocumentTypeChange = (text) => {
        setDocumentType(text);
    };

    const handleCheckInDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || checkInDate;
        setShowCheckInDatePicker(false);
        setCheckInDate(currentDate);
    };

    const handleDateOfBirthChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDateOfBirthPicker(false);
        setDateOfBirth(currentDate);
    };

    const handleCheckOutDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || checkOutDate;
        setShowCheckOutDatePicker(false);
        setCheckOutDate(currentDate);
    };


    const validateFieldState = () => {
        if (
            !checkInDate ||
            !checkOutDate ||
            !validateIds(idNumber) ||
            !issuer ||
            !guestName ||
            !guestLastName ||
            !dateOfBirth ||
            !validateIds(documentIdNumber) ||
            !organizationType ||
            !gender ||
            !citizenship ||
            !address
        ) {
            ToastAndroid.show("Please fill out all fields", ToastAndroid.SHORT);
            return false
        }
        return true;
    };


    const getDocumentTextDetection = async () : Promise<string> => {
        const imageData = await selectImage();

        let googleVisionRes = await fetch(googleVisionUrl+googleVisionApiKey,{
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": imageData
                        },
                        features: [
                            { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                        ],
                    }
                ]
            })
        });

        try {
            const response = await googleVisionRes.json();

            if (response.responses && response.responses.length > 0) {
                const fullTextAnnotation = response.responses[0].fullTextAnnotation.text;
                console.log(fullTextAnnotation);
                return fullTextAnnotation
            } else {
                console.log("No valid response or fullTextAnnotation found in the response.");
                return "";
            }
        } catch (error) {
            console.log("Error parsing or handling response:", error);
        }
    };

    const getParsedMRZ = async () =>{
        let fullTextAnnotation = await getDocumentTextDetection();
        let lastMRZChar = fullTextAnnotation.lastIndexOf('<');
        let MRZ = fullTextAnnotation.substring(lastMRZChar-92, lastMRZChar+1);
        const requestBody = {
            mrz: MRZ.toString().replace(/^\n/, '')
        };

        try {
            const authToken = await retrieveToken();
            const response = await axios.post(baseUrl+"/mrzparser/api/parse", requestBody, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                },
            });
            handleAutomaticFieldInput(response.data);
        }
        catch (error){
            ToastAndroid.show("Error reading ID card, please try again", ToastAndroid.SHORT);
        }
    }

    const handleRegistrationRequest = () =>{
        if (!validateFieldState()){
            ToastAndroid.show("Please fill out all the fields", ToastAndroid.SHORT);
        }else {
            const registrationData = {
                apartmentName: apartmentName,
                idNumber: idNumber,
                documentIdNumber: documentIdNumber,
                issuer: issuer,
                gender: gender,
                organizationType: organizationType,
                citizenship: citizenship,
                guestName: guestName,
                guestLastName: guestLastName,
                address: address,
                checkInDate: checkInDate,
                dateOfBirth: dateOfBirth,
                checkOutDate: checkOutDate,
                documentType: documentType
            };

            axios.post(baseUrl+'/mockevisitor/evisitor/register', registrationData)
                .then(response => {
                    console.log('Response:', response.data);
                    ToastAndroid.show("Guest added successfully", ToastAndroid.SHORT);

                })
                .catch(error => {
                    console.error('Error:', error);
                    ToastAndroid.show("Error registering guest, please check the provided information", ToastAndroid.SHORT);

                });
        }
    }

    const twoDigitYearToFourDigit = (year: string) => {
        let longYear = 0;
        let shortYrAsInt = parseInt(year);
        if (shortYrAsInt <= 23) {
            longYear = shortYrAsInt + 2000;
        } else {
            longYear = shortYrAsInt + 1900;
        }
        return longYear;
    }

    const dateFromString = (date: string)=>{
        const parts =date.split('/');
        return new Date(twoDigitYearToFourDigit(parts[2]), parseInt(parts[1]), parseInt(parts[0]));
    }

    const handleAutomaticFieldInput = (guest: any) => {
        setGuestName(guest.givenNames);
        setGuestLastName(guest.surname);
        setGender(guest.sex);
        setDateOfBirth(dateFromString(guest.dateOfBirth));
        setDocumentIdNumber(guest.documentNumber);
        setCitizenship(guest.nationality);
        setIdNumber(guest.optional);

        if (guest.code.toString().includes('Type')){
            setDocumentType('ID');
        }
        else if (guest.code.toString().includes('Passport')){
            setDocumentType('Passport');
        }
        else if (guest.code.toString().includes('Migrant')){
            setDocumentType('Migrant');
        }
        else{
            setDocumentType('');
        }
    }

    return (
        <InputScrollView>
            <View style={styles.container}>

                <View style={styles.inputContainer}>
                    <Text style={styles.apartmentTitle}>{apartmentName}</Text>

                    <Text style={styles.dateTimeText}>{currentDateTime}</Text>

                    <Text style={styles.dateTimeText}>The fields below will be automatically filled in after scan. Please fill out all the fields which are empty after scan </Text>


                    <TouchableOpacity style={styles.button} onPress={getParsedMRZ}>
                        <Text style={styles.buttonText}>Scan ID document</Text>
                    </TouchableOpacity>

                    <Text style={styles.inputTitle}>Guest first name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="John"
                        onChangeText={handleGuestNameChange}
                        value={guestName}
                    />

                    <Text style={styles.inputTitle}>Guest last name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Smith"
                        onChangeText={handleGuestLastNameChange}
                        value={guestLastName}
                    />


                    <Text style={styles.inputTitle}>Check-In Date</Text>
                    <TouchableOpacity style={{width:"100%", marginHorizontal: 20}} onPress={() => setShowCheckInDatePicker(true)}>
                        <Text style={styles.input}>{checkInDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showCheckInDatePicker && (
                        <RNDateTimePicker
                            value={checkInDate}
                            mode="date"
                            display="calendar"
                            onChange={handleCheckInDateChange}
                        />
                    )}

                    <Text style={styles.inputTitle}>Check-Out Date</Text>
                    <TouchableOpacity style={{width:"100%", marginHorizontal:20,}} onPress={() => setShowCheckOutDatePicker(true)}>
                        <Text style={styles.input}>{checkOutDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showCheckOutDatePicker && (
                        <RNDateTimePicker
                            value={checkOutDate}
                            mode="date"
                            display="calendar"
                            onChange={handleCheckOutDateChange}
                        />
                    )}

                    <Text style={styles.inputTitle}>Document type (Passport/ID)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Passport"
                        onChangeText={handleDocumentTypeChange}
                        value={documentType}
                    />
                    <Text style={styles.inputTitle}>Guest ID Number (OIB)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="38223234343"
                        keyboardType="number-pad"
                        onChangeText={handleIdNumberChange}
                        value={idNumber}
                    />
                    {idNumberError ? (
                        <Text style={styles.errorText}>{idNumberError}</Text>
                    ) : null}

                    <Text style={styles.inputTitle}>Document ID Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="38223234343"
                        keyboardType="number-pad"
                        onChangeText={handleDocumentIdNumberChange}
                        value={documentIdNumber}
                    />
                    {documentIdNumberError ? (
                        <Text style={styles.errorText}>{documentIdNumberError}</Text>
                    ) : null}


                    <Text style={styles.inputTitle}>Issuer</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Company name"
                        onChangeText={handleIssuerChange}
                        value={issuer}
                    />

                    <Text style={styles.inputTitle}>Citizenship</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="HRV"
                        onChangeText={handleCitizenshipChange}
                        value={citizenship}
                    />

                    <Text style={styles.inputTitle}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Sunny street 1, Osijek, Croatia"
                        onChangeText={handleAddressChange}
                        value={address}
                    />

                    <Text style={styles.inputTitle}>Date of birth</Text>
                    <TouchableOpacity style={{width:"100%", marginHorizontal:20,}} onPress={() => setShowDateOfBirthPicker(true)}>
                        <Text style={styles.input}>{dateOfBirth.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDateOfBirthPicker && (
                        <RNDateTimePicker
                            value={dateOfBirth}
                            mode="date"
                            display="calendar"
                            onChange={handleDateOfBirthChange}
                        />
                    )}

                    <Text style={styles.inputTitle}>Gender</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                gender === "Male" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleGenderChange("Male")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    gender === "Male" && styles.selectedRadioButtonText,
                                ]}
                            >
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                gender === "Female" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleGenderChange("Female")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    gender === "Female" && styles.selectedRadioButtonText,
                                ]}
                            >
                                Female
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputTitle}>Type of organization</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                organizationType === "personal" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleOrganizationTypeChange("personal")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    organizationType === "personal" && styles.selectedRadioButtonText,
                                ]}
                            >
                                Personal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                organizationType === "group" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleOrganizationTypeChange("group")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    organizationType === "group" && styles.selectedRadioButtonText,
                                ]}
                            >
                                Group
                            </Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.button} onPress={handleRegistrationRequest}>
                        <Text style={styles.buttonText}>Register guest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </InputScrollView>
    );
};



export default AddGuests;
