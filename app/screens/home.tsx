import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";

import React, {useEffect, useState} from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";
import {retrieveToken} from "../utils/retireveToken";
import jwtDecode from 'jwt-decode';
import axios from "axios";
import ApartmentCard from "../../components/common/ApartmentCard";
import apartmentImage from "../../assets/apartment.jpg";
import {useAuth} from "../context/AuthContext";

const Home = () => {
    const [username, setUsername] = useState(""); // State for storing the username
    const [apartments, setApartments] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const { onLogout } = useAuth();


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
        const apiUrl = 'https://e0e5-46-188-225-44.ngrok.io/apartments';

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
            if(response.data!==null){
            setApartments(response.data);}

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getTokenAndDecode();
        getUserApartments();
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
            setCurrentDateTime(formattedDateTime);
        };

        updateDateTime(); // Update immediately
        const interval = setInterval(updateDateTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <View
        style={{
            flex: 1
        }}>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingHorizontal: 15,
                    paddingRight: 20,
                    marginHorizontal: 10,
                    backgroundColor: COLORS.trueWhite,
                    //borderBottomLeftRadius: 10,
                    //borderBottomRightRadius: 10,
                    borderRadius: 10,
                    elevation: 5,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontFamily: FONT.bold,
                            fontSize: SIZES.medium,
                            textAlign: 'left',
                            color: COLORS.primary,
                        }}
                    >
                        Welcome {username ? username : ''}
                    </Text>
                    <Text
                        style={{
                            fontFamily: FONT.regular,
                            fontSize: SIZES.small,
                            color: COLORS.secondary,
                            paddingTop: 4,
                        }}
                    >
                        {currentDateTime}
                    </Text>
                </View>
                <TouchableOpacity onPress={onLogout}>
                    <Text
                        style={{
                            fontFamily: FONT.regular,
                            fontSize: SIZES.medium,
                            color: COLORS.primary,
                        }}
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{
                marginHorizontal: 20,
                marginTop: 20,
                fontFamily: FONT.regular,
                fontSize: SIZES.xLarge,
                textAlign: 'left',
                color: COLORS.primary
            }}>
                Manage your guests here
            </Text>
            <Text style={{
                marginTop: 7,
                marginBottom: 25,
                marginHorizontal: 20,
                fontFamily: FONT.regular,
                fontSize: SIZES.medium,
                textAlign: 'left',
                color: COLORS.secondary
            }}>
                Register guests with e-visitor or generate a PDF estimation
            </Text>
            {apartments.length > 0 ? (
                <FlatList
                    data={apartments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ApartmentCard
                            title={item.name}
                            description={item.details}
                            imageUrl={apartmentImage}
                            beds={item.numberOfBeds}
                            rooms={item.numberOfRooms}
                        />
                    )}
                />
            ) : (
                <Text style={{
                    fontFamily:FONT.bold,
                    textAlign: "center",
                    fontSize: SIZES.small,
                    marginHorizontal: 30,
                    marginTop: 20,
                    color: COLORS.secondary
                }}>You have no registered apartments. Please contact e-visitor support</Text>
            )}
        </View>
    );
};

export default Home;