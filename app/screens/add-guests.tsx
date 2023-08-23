import {Linking, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import InputScrollView from "react-native-input-scroll-view";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import base64js from "base64-js"
import * as Sharing from "expo-sharing"
import styles from "../styles/component-styling";
import CameraButton from "../../components/common/CameraButton";

const AddGuests = ({route}) => {
    const { apartmentName } = route.params
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [documentIdNumber, setDocumentIdNumber] = useState("");
    const [issuer, setIssuer] = useState("");
    const [gender, setGender] = useState("");
    const [organizationType, setOrganizationType] = useState("");
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

    const validateInteger = (text) => {
        return /^0$|^[1-9]\d*$/.test(text); // Allow 0 or positive integers without leading zeroes
    };

    const validateIds = (text) => {
        return /^\d+$/.test(text); // Allow 0 or positive integers without leading zeroes
    };


    const validateDecimal = (text) => {
        return /^\d+(\.\d+)?$/.test(text);
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


    const handleGeneratePDF = async () => {
        // Check for empty or invalid fields
        if (
            !checkInDate ||
            !checkOutDate ||
            !validateInteger(idNumber) ||
            !issuer ||
            !guestName ||
            !guestLastName
        ) {
            ToastAndroid.show("Please fill out all the text fields", ToastAndroid.SHORT);
            return;
        }

        // Create the request body
        const requestBody = {
            name: guestName,
            apartment: apartmentName,
            idNumber: idNumber,
            arrivalDate: checkInDate.toLocaleDateString(),
            endDate: checkOutDate.toLocaleDateString(),
            issuer: issuer,
            issueDate: currentDateTime,
        };

        // Make the POST request

        try {
            // Configure Axios to handle response data as a raw binary response
            const response = await axios.post("https://e613-46-188-225-44.ngrok.io/pdfgenerator/generate", requestBody, {
                responseType: 'arraybuffer', // Handle response as an ArrayBuffer
                headers: {
                    'Accept': 'application/pdf', // Request PDF format
                },
            });

            const pdfData = response.data; // PDF data as ArrayBuffer

            const base64PdfData = base64js.fromByteArray(new Uint8Array(pdfData));

            // Create a path to save the PDF locally
            const pdfUri = `${FileSystem.cacheDirectory}generated.pdf`;

            // Write the PDF data to the file
            await FileSystem.writeAsStringAsync(pdfUri, base64PdfData, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log("PDF saved at:", pdfUri);

            // Show a toast indicating successful PDF generation
            ToastAndroid.show("PDF generated and saved", ToastAndroid.SHORT);

            // Share the PDF file
            await Sharing.shareAsync(pdfUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Share PDF Estimation',
                UTI: 'com.adobe.pdf', // iOS-specific UTI
            });

        } catch (error) {
            console.error("Error generating or saving PDF:", error);
            ToastAndroid.show("Error generating or saving PDF", ToastAndroid.SHORT);
        }
    };

    return (
        <InputScrollView>
            <View style={styles.container}>

                <View style={styles.inputContainer}>
                    <Text style={styles.apartmentTitle}>{apartmentName}</Text>

                    <Text style={styles.dateTimeText}>{currentDateTime}</Text>

                   <CameraButton></CameraButton>

                    <Text style={styles.dateTimeText}>The fields below will be automatically filled in after scan. Please fill out all the fields which are empty after scan </Text>

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


                    {/* Check-In Date */}
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

                    {/* Check-Out Date */}
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
                                gender === "male" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleGenderChange("male")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    gender === "male" && styles.selectedRadioButtonText,
                                ]}
                            >
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                gender === "female" && styles.selectedRadioButton,
                            ]}
                            onPress={() => handleGenderChange("female")}
                        >
                            <Text
                                style={[
                                    styles.radioButtonText,
                                    gender === "female" && styles.selectedRadioButtonText,
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


                    <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
                        <Text style={styles.buttonText}>Register guest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </InputScrollView>
    );
};



export default AddGuests;