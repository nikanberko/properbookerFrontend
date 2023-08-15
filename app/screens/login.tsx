import {View, Text, TextInput, Button} from "react-native";
import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";


const Login = () => {
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
        <View>
            <TextInput placeholder="username" onChangeText={(text:string) => setUsername(text)} value={username}></TextInput>
            <TextInput placeholder="password" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password}></TextInput>
            <Button onPress={login} title="Sign in"></Button>
            <Button onPress={register} title="Create account"></Button>

        </View>
    )
}

export default Login;