import { StyleSheet } from "react-native";
import {COLORS, FONT, SHADOWS, SIZES} from "../../constants/theme";


const styles = StyleSheet.create({
    textInput: {
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        backgroundColor: "#FFF",
        shadowColor: COLORS.white,
    },
    container: {
        flex: 1,
        marginBottom: 10
    },

    radioContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    radioButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        alignItems: "center",
    },
    selectedRadioButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    radioButtonText: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
    },
    selectedRadioButtonText: {
        color: "white",
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
        textAlign: "center"
    },
    inputTitle: {
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        marginBottom: 5,
        marginTop: 15,
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
        marginTop: 15,
        marginBottom:5
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


export default styles;
