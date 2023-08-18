import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";

const PdfGenerator = ({route}) => {
    const { apartmentName } = route.params
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [numberOfStays, setNumberOfStays] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [discount, setDiscount] = useState("");
    const [numberOfStaysError, setNumberOfStaysError] = useState("");
    const [pricePerNightError, setPricePerNightError] = useState("");
    const [idNumberError, setIdNumberError] = useState("");
    const [discountError, setDiscountError] = useState("");

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = now.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
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

    const validateDecimal = (text) => {
        return /^\d+(\.\d+)?$/.test(text);
    };

    const handleNumberOfStaysChange = (text) => {
        if (!validateInteger(text)) {
            setNumberOfStaysError("Please enter a valid integer");
        } else {
            setNumberOfStaysError("");
        }
        setNumberOfStays(text);
    };

    const handlePricePerNightChange = (text) => {
        if (!validateDecimal(text)) {
            setPricePerNightError("Please enter a valid decimal number");
        } else {
            setPricePerNightError("");
        }
        setPricePerNight(text);
    };

    const handleIdNumberChange = (text) => {
        if (!validateInteger(text)) {
            setIdNumberError("Please enter a valid integer");
        } else {
            setIdNumberError("");
        }
        setIdNumber(text);
    };

    const handleDiscountChange = (text) => {
        if (!validateDecimal(text)) {
            setDiscountError("Please enter a valid decimal number");
        } else {
            setDiscountError("");
        }
        setDiscount(text);
    };

    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>
                <Text style={styles.apartmentTitle}>{apartmentName}</Text>

                <Text style={styles.dateTimeText}>{currentDateTime}</Text>

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

                <Text style={styles.inputTitle}>ID Number</Text>
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

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Generate PDF estimation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginTop: 10,
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
