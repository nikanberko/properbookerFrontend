import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../../constants/theme';
import {useNavigation} from "@react-navigation/native";
import AddGuests from "../../app/screens/add-guests";

const ApartmentCard = ({ title, imageUrl, description, beds, rooms }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.card}>
            <Image source={imageUrl} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>{`${beds} beds • ${rooms} rooms`}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('AddGuests', {apartmentName: title})}}>
                        <Text style={styles.buttonText}>Add guest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PdfGenerator', { apartmentName: title})}>
                        <Text style={styles.buttonText}>PDF Receipt</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        overflow: 'hidden',
        margin: 10,
    },
    image: {
        height: 100,
        width: '100%',
    },
    details: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        marginTop: 5,
        color: 'gray',
    },
    infoContainer: {
        marginTop: 5, // Adjust the margin as needed
    },
    infoText: {
        fontSize: 12,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
    button: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        width: '40%',
        marginHorizontal: 10,
    },
    buttonText: {
        color: COLORS.primary,
        fontFamily: FONT.regular,
        textAlign: 'center',
    },
});

export default ApartmentCard;