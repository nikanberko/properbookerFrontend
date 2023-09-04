import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import React from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";


const Registration = ({navigation}) => {

    return (

        <SafeAreaView style={{
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.trueWhite
        }}>


            <View style={{
                padding: 10 * 2,
            }}>

                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: SIZES.xxLarge,
                            color: COLORS.primary,
                            fontFamily: FONT.regular,
                            marginVertical: 10 * 3,
                            marginTop: 150,
                            textAlign:"center"
                        }}
                    >
                        Oops! It looks like you don't have an account
                    </Text>
                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: FONT.regular,
                            color:COLORS.tertiary,
                            fontSize: SIZES.large,
                            maxWidth: "80%",
                            textAlign: "center",
                            marginBottom:20
                        }}
                    >
                        Please contact e-visitor support to create a new account
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={{
                            marginTop: 40,
                            backgroundColor: COLORS.primary,
                            paddingVertical: 10 * 1.5,
                            paddingHorizontal: 10 * 2,
                            width: "48%",
                            borderRadius: 10,
                            shadowColor: COLORS.primary,
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                color: COLORS.white,
                                fontSize: SIZES.large,
                                textAlign: "center",
                            }}
                        >
                             Go to Login
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>

        </SafeAreaView>
    )
}

export default Registration;