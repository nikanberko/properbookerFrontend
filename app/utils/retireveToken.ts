import * as SecureStore from 'expo-secure-store';

export const retrieveToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('my_jwt');
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};
