import {
    StyleSheet,
    TextInput,
} from "react-native";
import React, { useState } from "react";
import {COLORS, FONT, SIZES} from "../../constants/theme";

const AppTextInputMultiple = ({ ...otherProps }) => {
    const [focused, setFocused] = useState(false);
    return (
        <TextInput
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor={COLORS.primary}
            style={[
                {
                    fontFamily: FONT.regular,
                    fontSize: SIZES.small,
                    padding: 15,
                    backgroundColor: COLORS.white,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: SIZES.medium,
                    marginVertical: 20,
                },
                focused && {
                    borderWidth: 2,
                    borderColor: COLORS.primary,
                    shadowOffset: { width: 4, height: 10 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                },
                {width: '100%'}
            ]}
            {...otherProps}
        />
    );
};

export default AppTextInputMultiple;

const styles = StyleSheet.create({});