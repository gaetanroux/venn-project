import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import app from "../../app.json";
import ColorContext from "../ColorContext";
import Button from "../components/Button";
import useGetAll from "../hooks/useGetAll";

const Tab = createBottomTabNavigator();

function CreateMembers({ navigation }) {
  const { data } = useGetAll("members");
  const [, setColor] = useContext(ColorContext);
  const [newfirstname, setfirstname] = useState("");
  const [newlastname, setlastname] = useState("");
  const [newfavoritecolor, setfavoritecolor] = useState("");
  const [member, setMember] = useState(null);
  const [error, setError] = useState(false);
  const styles = createStyles({
    error,
    member: Boolean(member),
  });
  const header = (
    <View style={styles.title}>
      <Text style={styles.title}>{app.expo.name}</Text>
      <Image source={require("../../assets/icon.png")} style={styles.logo} />
    </View>
  );
  const onChangefirstname = (firstname) => {
    setfirstname(firstname);
  };
  const onChangelastname = (lastname) => {
    setlastname(lastname);
  };
  const onChangefavoritecolor = (favoritecolor) => {
    setfavoritecolor(favoritecolor);
  };
  const onNavigateToHome = () => {
    navigation.navigate("Identification");
  };
  const CreateMember = () => {
    const value = newfirstname + " " + newlastname;
    if (value.length > 0 && data?.length > 0) {
      const found = data.find(({ lastname, firstname }) =>
        value.match(
          new RegExp(
            `(${firstname} ${lastname})|(${lastname} ${firstname})`,
            "i"
          )
        )
      );

      if (!found) {
        addDoc(collection(db, "members"), {
          firstname: newfirstname,
          lastname: newlastname,
          favoritecolor: newfavoritecolor,
        });
        console.log("Utilisateur créer !");
      } else {
        console.log("Utilisateur déjà créer !");
      }
    }
  };
  return (
    <View style={styles.root}>
      {header}
      <View style={styles.content}>
        <View>
          <TextInput
            placeholder="firstname"
            style={styles.input}
            value={newfirstname}
            onChangeText={onChangefirstname}
          />
          <TextInput
            placeholder="lastname"
            style={styles.input}
            value={newlastname}
            onChangeText={onChangelastname}
          />
          <TextInput
            placeholder="favoritecolor"
            style={styles.input}
            value={newfavoritecolor}
            onChangeText={onChangefavoritecolor}
          />
          <Text style={styles.error}>Désolé, tu n'es pas enregistré·e.</Text>
        </View>
        <View style={styles.actions}>
          <Button title="S'enregistrer" onPress={onNavigateToHome} />
        </View>
      </View>
    </View>
  );
}

const createStyles = ({ error, member }) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "center",
    },
    header: {
      flexDirection: error || member ? "row" : "column",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: error || member ? 1 : 0,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: error || member ? 12 : 32,
      fontWeight: "700",
    },
    logo: {
      height: error || member ? 32 : 192,
      width: error || member ? 32 : 192,
      marginLeft: error || member ? 8 : 0,
    },
    input: {
      borderColor: error ? "red" : "black",
      borderWidth: 4,
      borderStyle: "solid",
      backgroundColor: "rgba(0,0,0,0.1)",
      padding: 8,
      width: Dimensions.get("window").width - 64,
      fontSize: 20,
      fontWeight: "700",
      marginVertical: 8,
    },
    error: {
      color: "red",
    },
    actions: {
      marginVertical: 16,
    },
    textButtonError: {
      color: "red",
      fontSize: 20,
      alignSelf: "center",
    },
    textButtonSuccess: {
      color: "green",
      fontSize: 20,
      alignSelf: "center",
    },
    button: {
      backgroundColor: "white",
    },
  });

export default CreateMembers;
