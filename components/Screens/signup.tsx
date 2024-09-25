import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import CheckBox from "react-native-check-box";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import { createUser } from "@/app/api-request/user_api"; // Import createUser function

type EleMoveScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type EleMoveScreenRouteProp = RouteProp<RootStackParamList, "Signup">;

type Props = {
  navigation: EleMoveScreenNavigationProp;
  route: EleMoveScreenRouteProp;
};

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  password: string;
  phone: string;
}

interface Errors {
  firstname?: string;
  lastname?: string;
  email?: string;
  gender?: string;
  password?: string;
}

const Signup: React.FC<Props> = ({ route, navigation }) => {
  const { phone } = route.params;

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    password: "",
    phone: phone,
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
   if (validate()) {
     try {
       const userResponse = await createUser(formData);
       console.log("User response:", userResponse); // Log the user response

       if (
         userResponse &&
         userResponse.message === "User created successfully"
       ) {
         if (userResponse.data && userResponse.data.id) {
           Alert.alert("Success", "Registration successful!", [
             {
               text: "OK",
               onPress: () => {
                 navigation.navigate("Login", {
                   phone: formData.phone,
                   user_id: userResponse.data.id,
                 });
               },
             },
           ]);
         } else {
           Alert.alert(
             "Error",
             "Failed to register user. Please try again later."
           );
         }
       } else {
         Alert.alert(
           "Error",
           userResponse.error ||
             "Failed to register user. Please try again later."
         );
       }
     } catch (error) {
       console.error("Error in handleSubmit:", error);
       Alert.alert("Error", "Failed to register user. Please try again later.");
     }
   }
 };



  return (
    <View style={styles.userContainer}>
      <Text style={styles.userTitle}>EleMove</Text>
      <View style={styles.userPhoneContainer}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
          }}
          style={styles.userFlag}
        />
        <Text style={styles.userPhoneNumber}>{phone}</Text>
      </View>
      <View style={styles.userRow}>
        <View style={styles.userHalfInputContainer}>
          <TextInput
            style={styles.userInput}
            placeholder="First Name"
            value={formData.firstname}
            onChangeText={(value) => handleInputChange("firstname", value)}
          />
          {errors.firstname && (
            <Text style={styles.userError}>{errors.firstname}</Text>
          )}
        </View>
        <View style={styles.userHalfInputContainer}>
          <TextInput
            style={styles.userInput}
            placeholder="Last Name"
            value={formData.lastname}
            onChangeText={(value) => handleInputChange("lastname", value)}
          />
          {errors.lastname && (
            <Text style={styles.userError}>{errors.lastname}</Text>
          )}
        </View>
      </View>
      <TextInput
        style={styles.userInput}
        placeholder="Email Id"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />
      {errors.email && <Text style={styles.userError}>{errors.email}</Text>}

      <View style={styles.userGenderContainer}>
        <Text>Gender:</Text>
        <View style={styles.userCheckboxContainer}>
          <CheckBox
            isChecked={formData.gender === "M"}
            onClick={() => handleInputChange("gender", "M")}
          />
          <Text style={styles.userGenderText}>Male</Text>
        </View>
        <View style={styles.userCheckboxContainer}>
          <CheckBox
            isChecked={formData.gender === "F"}
            onClick={() => handleInputChange("gender", "F")}
          />
          <Text style={styles.userGenderText}>Female</Text>
        </View>
      </View>
      {errors.gender && <Text style={styles.userError}>{errors.gender}</Text>}

      <TextInput
        style={styles.userInput}
        placeholder="Password"
        value={formData.password}
        secureTextEntry
        onChangeText={(value) => handleInputChange("password", value)}
      />
      {errors.password && (
        <Text style={styles.userError}>{errors.password}</Text>
      )}

      <TouchableOpacity style={styles.userButton} onPress={handleSubmit}>
        <Text style={styles.userButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingTop: 50,
    paddingBottom: 300,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  userTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "blue",
  },
  userPhoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  userFlag: {
    width: 27,
    height: 20,
    marginRight: 10,
  },
  userPhoneNumber: {
    fontSize: 18,
  },
  userInput: {
    borderBottomWidth: 1,
    borderBottomColor: "darkgrey",
    marginBottom: 10,
    paddingVertical: 5,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userHalfInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  userGenderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  userCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  userGenderText: {
    marginLeft: 10,
  },
  userButton: {
    backgroundColor: "#0000ff",
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  userButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  userError: {
    color: "red",
    marginBottom: 10,
  },
});

export default Signup;