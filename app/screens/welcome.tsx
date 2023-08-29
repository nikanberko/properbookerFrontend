import { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {COLORS, FONT, SIZES} from "../../constants/theme";
const { height } = Dimensions.get("window");

const Welcome = ({navigation}) => {


    return (
        <SafeAreaView style={{
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.trueWhite
        }}>
            <View>
                <ImageBackground
                    style={{
                        height: height/2,
                        backgroundColor: COLORS.trueWhite
                    }}
                    resizeMode="contain"
                    source={require("../../assets/businessman.jpg")}
                />
                <View
                    style={{
                        paddingHorizontal: 0,
                        paddingTop: 0,
                    }}
                >
                </View>
            </View>
            <View style={{
                backgroundColor:COLORS.trueWhite
            }}>
                <View
                    style={{
                        paddingHorizontal: 10 * 4,
                        paddingTop: 10 ,
                    }}
                >
                    <Text
                        style={{
                            fontSize: SIZES.xxxLarge,
                            color: COLORS.primary,
                            fontFamily: FONT.bold,
                            textAlign: "left",
                            marginTop: 10
                        }}
                    >
                        Welcome to Properbooker!
                    </Text>

                    <Text
                        style={{
                            fontSize: SIZES.medium,
                            color: COLORS.primary,
                            fontFamily: FONT.regular,
                            textAlign: "left",
                            marginTop: 20,
                        }}
                    >
                        Easily manage your guests and create estimations
                    </Text>
                </View>
                <View
                    style={{
                        paddingHorizontal: 10 * 2,
                        paddingTop: 10 * 6,
                        flexDirection: "row",
                        backgroundColor: COLORS.trueWhite
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={{
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
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Registration")}
                        style={{
                            paddingVertical: 10 * 1.5,
                            paddingHorizontal: 10 * 2,
                            width: "48%",
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                color: COLORS.primary,
                                fontSize: SIZES.large,
                                textAlign: "center",
                            }}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    backgroundColor: COLORS.trueWhite
                }}>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default Welcome;
