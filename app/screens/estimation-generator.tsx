import {Linking, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import InputScrollView from "react-native-input-scroll-view";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import base64js from "base64-js"
import * as Sharing from "expo-sharing"

const PdfGenerator = ({route}) => {
    const { apartmentName } = route.params
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [numberOfStays, setNumberOfStays] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [issuerIdNumber, setIssuerIdNumber] = useState("");
    const [issuer, setIssuer] = useState("");
    const [estimationFor, setEstimationFor] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [issuerError, setIssuerError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [invoiceNumberError, setInvoiceNumberError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [issuerIdNumberError, setIssuerIdNumberError] = useState("");
    const [discount, setDiscount] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState("");
    const [numberOfStaysError, setNumberOfStaysError] = useState("");
    const [numberOfGuestsError, setNumberOfGuestsError] = useState("");
    const [pricePerNightError, setPricePerNightError] = useState("");
    const [idNumberError, setIdNumberError] = useState("");
    const [discountError, setDiscountError] = useState("");
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
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

    const validatePhoneNumber = (text) => {
        return /^\d+$/.test(text); // too many phone number formats, this validates just numbers
    };
    const validateEmail = (text) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)
    };

    const validateDecimal = (text) => {
        return /^\d+(\.\d+)?$/.test(text);
    };

    const handleNumberOfStaysChange = (text) => {
        if (!validateInteger(text)) {
            setNumberOfStaysError("Please enter a valid number of stays");
        } else {
            setNumberOfStaysError("");
        }
        setNumberOfStays(text);
    };

    const handlePricePerNightChange = (text) => {
        if (!validateDecimal(text)) {
            setPricePerNightError("Please enter a valid price");
        } else {
            setPricePerNightError("");
        }
        setPricePerNight(text);
    };

    const handleIdNumberChange = (text) => {
        if (!validateIds(text)) {
            setIdNumberError("Please enter a valid id number");
        } else {
            setIdNumberError("");
        }
        setIdNumber(text);
    };

    const handleIssuerIdNumberChange = (text) => {
        if (!validateIds(text)) {
            setIssuerIdNumberError("Please enter a valid issuer id number");
        } else {
            setIssuerIdNumberError("");
        }
        setIssuerIdNumber(text);
    };

    const handleTelephoneChange = (text) => {
        if (!validatePhoneNumber(text)) {
            setTelephoneError("Please enter a valid phone number number");
        } else {
            setTelephoneError("");
        }
        setTelephone(text);
    };
    const handleEmailChange = (text) => {
        if (!validateEmail(text)) {
            setEmailError("Please enter a valid e-mail");
        } else {
            setEmailError("");
        }
        setEmail(text);
    };
    const handleIssuerChange = (text) => {
        setIssuer(text);
    };

    const handleEstimationForChange = (text) => {
        setEstimationFor(text);
    };

    const handleDiscountChange = (text) => {
        if (!validateDecimal(text)) {
            setDiscountError("Please enter a valid discount value");
        } else {
            setDiscountError("");
        }
        setDiscount(text);
    };

    const handleInvoiceNumberChange = (text) => {
        if (!validateIds(text)) {
            setInvoiceNumberError("Invoice number must be a number");
        } else {
            setInvoiceNumberError("");
        }
        setInvoiceNumber(text);
    };

    const handleNumberOfGuestsChange = (text) => {
        if (!validateInteger(text)) {
            setNumberOfGuestsError("Please enter a valid number of guests");
        } else {
            setNumberOfGuestsError("");
        }
        setNumberOfGuests(text);
    };

    const handleCheckInDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || checkInDate;
        setShowCheckInDatePicker(false);
        setCheckInDate(currentDate);
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
            !validateInteger(numberOfStays) ||
            !validateDecimal(pricePerNight) ||
            !validateInteger(idNumber) ||
            !validateIds(issuerIdNumber) ||
            !validatePhoneNumber(telephone) ||
           // !validateEmail(email) ||
            !validateDecimal(discount) ||
            !validateIds(invoiceNumber)
        ) {
            ToastAndroid.show("Please fill out all the text fields", ToastAndroid.SHORT);
            return;
        }

        // Create the request body
        const requestBody = {
            name: estimationFor,
            apartment: apartmentName,
            idNumber: idNumber,
            numberOfGuests: parseInt(numberOfGuests),
            numberOfStays: parseInt(numberOfStays),
            arrivalDate: checkInDate.toLocaleDateString(),
            endDate: checkOutDate.toLocaleDateString(),
            discount: parseFloat(discount),
            issuer: issuer,
            issueDate: currentDateTime,
            price: parseInt(pricePerNight),
            invoiceNumber: invoiceNumber,
            telephone: telephone,
            email: email,
            issuerId: issuerIdNumber
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

                <Text style={styles.inputTitle}>Estimation for:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Guest or company name"
                    onChangeText={handleEstimationForChange}
                    value={estimationFor}
                />


                <Text style={styles.inputTitle}>Number of guests</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2"
                    keyboardType="number-pad"
                    onChangeText={handleNumberOfGuestsChange}
                    value={numberOfGuests}
                />
                {numberOfStaysError ? (
                    <Text style={styles.errorText}>{numberOfGuestsError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Number of Stays</Text>
                <TextInput
                    style={styles.input}
                    placeholder="2"
                    keyboardType="number-pad"
                    onChangeText={handleNumberOfStaysChange}
                    value={numberOfStays}
                />
                {numberOfStaysError ? (
                    <Text style={styles.errorText}>{numberOfStaysError}</Text>
                ) : null}

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

                <Text style={styles.inputTitle}>Price Per Night (€)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="35.50"
                    keyboardType="decimal-pad"
                    onChangeText={handlePricePerNightChange}
                    value={pricePerNight}
                />
                {pricePerNightError ? (
                    <Text style={styles.errorText}>{pricePerNightError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Guest ID Number</Text>
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

                <Text style={styles.inputTitle}>Issuer ID Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="38223234343"
                    keyboardType="number-pad"
                    onChangeText={handleIssuerIdNumberChange}
                    value={issuerIdNumber}
                />

                {issuerIdNumberError ? (
                    <Text style={styles.errorText}>{issuerIdNumberError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Issuer (owner or company name)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Owner name or company"
                    onChangeText={handleIssuerChange}
                    value={issuer}
                />

                {issuerError ? (
                    <Text style={styles.errorText}>{issuerError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Your phone number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="099234567"
                    keyboardType="number-pad"
                    onChangeText={handleTelephoneChange}
                    value={telephone}
                />

                {telephoneError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Your e-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="user@user.com"
                    onChangeText={handleEmailChange}
                    value={email}
                />

                {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                ) : null}


                <Text style={styles.inputTitle}>Discount (%)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="30%"
                    keyboardType="decimal-pad"
                    onChangeText={handleDiscountChange}
                    value={discount}
                />
                {discountError ? (
                    <Text style={styles.errorText}>{discountError}</Text>
                ) : null}

                <Text style={styles.inputTitle}>Invoice number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="1008"
                    keyboardType="decimal-pad"
                    onChangeText={handleInvoiceNumberChange}
                    value={invoiceNumber}
                />
                {discountError ? (
                    <Text style={styles.errorText}>{invoiceNumberError}</Text>
                ) : null}

                <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
                    <Text style={styles.buttonText}>Generate PDF estimation</Text>
                </TouchableOpacity>
            </View>
        </View>
        </InputScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10
    },
    inputContainer: {
        alignItems: "center",
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
        paddingRight: 20,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
    },
    apartmentTitle: {
        fontSize: SIZES.large,
        color: COLORS.primary,
        marginBottom: 5,
        marginTop: 10,
        fontFamily:FONT.bold
    },
    dateTimeText: {
        fontSize: SIZES.small,
        color: "gray",
        paddingTop: 4,
        marginBottom: 20,

    },
    inputTitle: {
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        marginBottom: 5,
        marginTop: 15,
        fontFamily:FONT.regular
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        padding: 10,
    },
    button: {
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        width: "100%",
        marginHorizontal: 10,
        marginTop: 15
    },
    buttonText: {
        color: COLORS.secondary,
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.medium
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 2,
        fontFamily: FONT.regular
    },
});

export default PdfGenerator;
