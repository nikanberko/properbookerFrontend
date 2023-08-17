import {FlatList, Image, Text, View} from "react-native";

import React, {useEffect, useState} from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";
import {retrieveToken} from "../utils/retireveToken";
import jwtDecode from 'jwt-decode';
import axios from "axios";
import ApartmentCard from "../../components/common/ApartmentCard";
import apartmentImage from "../../assets/apartment.jpg";

const Home = () => {
    const [username, setUsername] = useState(""); // State for storing the username
    const [apartments, setApartments] = useState([]);

    const getTokenAndDecode = async () => {
        const token = await retrieveToken();
        if (token) {
            // Decode the token payload
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.sub); // Set the username state
        } else {
            setUsername(null);
        }
    };

    const getUserApartments = async () => {
        // Your API endpoint URL
        const apiUrl = 'https://b0a1-31-217-45-155.ngrok.io/apartments';

        // Your authorization token
        const authToken = await retrieveToken();

        // Set up Axios instance with default headers
        const axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json', // You can adjust this header if needed
            },
        });

        try {
            // Make the GET request
            const response = await axiosInstance.get('/getall');
            setApartments(response.data);
            console.log('Response:', response.data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getTokenAndDecode();
        getUserApartments();
    }, []);

    return (
        <View
        style={{
            flex: 1
        }}>

            <Text style={{
                marginTop: 60,
                marginHorizontal: 20,
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
                textAlign: 'left',
                color: COLORS.secondary
            }}>
                Welcome {username ? username : ""}
            </Text>

            <Text style={{
                marginHorizontal: 20,
                marginTop: 15,
                fontFamily: FONT.regular,
                fontSize: SIZES.xLarge,
                textAlign: 'left',
                color: COLORS.primary
            }}>
                Manage your guests here
            </Text>
            <Text style={{
                marginTop: 10,
                marginBottom: 35,
                marginHorizontal: 20,
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
                textAlign: 'left',
                color: COLORS.secondary
            }}>
                Register guests with e-visitor or generate a PDF estimation
            </Text>
            <FlatList
                data={apartments}
                keyExtractor={(item) => item.id.toString()} // Assuming 'id' is the unique identifier
                renderItem={({ item }) => (
                        <ApartmentCard title={item.name} description={item.details} imageUrl={apartmentImage}></ApartmentCard>
                )}
            />
        </View>
    );
};

export default Home;