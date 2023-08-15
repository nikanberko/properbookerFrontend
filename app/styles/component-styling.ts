import { StyleSheet } from "react-native";
import {COLORS, SHADOWS, SIZES} from "../../constants/theme";


const styles = StyleSheet.create({
    textInput: {
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        backgroundColor: "#FFF",
        shadowColor: COLORS.white,
    },
});

export default styles;
