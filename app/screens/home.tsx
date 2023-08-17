import {FlatList, Text, View} from "react-native";

import React, {useEffect, useState} from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";
import {retrieveToken} from "../utils/retireveToken";
import jwtDecode from 'jwt-decode';
import axios from "axios";

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
        const apiUrl = 'https://8338-31-217-45-155.ngrok.io/apartments';

        // Your authorization token
        const authToken = 'your-auth-token';

        // Set up Axios instance with default headers
        const axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                //'Authorization': `Bearer ${authToken}`,
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
        <View>
            <Text style={{
                marginTop: 50,
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
                marginTop: 10,
                fontFamily: FONT.regular,
                fontSize: SIZES.xLarge,
                textAlign: 'left',
                color: COLORS.primary
            }}>
                Manage your guests here
            </Text>
            <FlatList data={apartments} renderItem={({item}) => (
                <Text>{item.username}</Text>
            )}/>
        </View>
    );
};

export default Home;