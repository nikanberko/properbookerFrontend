import {View, Text, TextInput, Button, SafeAreaView, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import styles from "../styles/component-styling";
import AppTextInput from "../../components/common/AppTextInput";
import {COLORS, FONT, SIZES} from "../../constants/theme";


const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin, onRegister} = useAuth();

    const login = async () => {
        console.log("entering login");
        const result = await onLogin!(username, password);
        console.log("exiting login");
        if(result && result.error) {
            alert(result.msg);
        }
    };

    const register = async () => {
        const result = await onRegister!(username,password);
        if(result && result.error) {
            alert(result.msg);
        } else {
            await login();
        }
    }
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
                        marginTop: 100,
                        textAlign:"center"
                    }}
                >
                    Login with your e-visitor account
                </Text>
                <Text
                    style={{
                        fontFamily: FONT.regular,
                        fontSize: SIZES.large,
                        maxWidth: "60%",
                        textAlign: "center",
                        marginBottom:20
                    }}
                >
                    Welcome back you've been missed!
                </Text>
            </View>

            <AppTextInput placeholder="Username" onChangeText={(text:string) => setUsername(text)} value={username}></AppTextInput>
            <AppTextInput placeholder="Password" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password}></AppTextInput>
            <TouchableOpacity style={{
                padding: 15,
                backgroundColor: COLORS.primary,
                marginVertical: 10 ,
                marginHorizontal: 10,
                marginTop:30,
                borderRadius: 10,
                shadowColor: COLORS.primary,
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            }} onPress={login} >
                <Text
                    style={{
                        fontFamily: FONT.regular,
                        color: COLORS.trueWhite,
                        textAlign: "center",
                        fontSize: SIZES.medium,
                    }}
                >
                    Sign in
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
            padding: 10}
            } onPress={register} >
                <Text
                    style={{
                        fontFamily: FONT.regular,
                        color: COLORS.primary,
                        textAlign: "center",
                        fontSize: SIZES.small,
                        marginBottom: SIZES.medium
                    }}
                >
                    Or
                </Text>
                <Text
                    style={{
                        fontFamily: FONT.regular,
                        color: COLORS.primary,
                        textAlign: "center",
                        fontSize: SIZES.medium,
                    }}
                >
                    Create a new account
                </Text>

            </TouchableOpacity>

        </View>

        </SafeAreaView>
    )
}

export default Login;