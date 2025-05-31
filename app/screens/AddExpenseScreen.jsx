import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BackgroundImage from "../../assets/background.png";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(null);
  const router = useRouter();

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      },
    });
  };

  const saveExpense = async () => {
    if (!amount || !category || !date) {
      Alert.alert("Please fill all fields.");
      return;
    }

    const newExpense = {
      amount,
      category,
      date: format(date, "yyyy-MM-dd"),
    };

    try {
      const existing = await AsyncStorage.getItem("expenses");
      const expenses = existing ? JSON.parse(existing) : [];
      expenses.push(newExpense);

      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
      Alert.alert("Expense saved!");
      router.push("/");
    } catch (error) {
      Alert.alert("Failed to save expense.");
      console.error(error);
    }
  };

  const { width, height } = Dimensions.get("window");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-50"
    >
      {/* Background Image */}
      <Image
        source={BackgroundImage}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="p-5"
      >
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-slate-900 text-center mb-8">
            Add Expense
          </Text>

          <TextInput
            placeholder="Amount (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="bg-white p-4 rounded-xl text-base mb-5 border border-slate-200 shadow-sm"
          />

          <TextInput
            placeholder="Category (e.g. Food, Travel)"
            placeholderTextColor="#999"
            value={category}
            onChangeText={setCategory}
            className="bg-white p-4 rounded-xl text-base mb-5 border border-slate-200 shadow-sm"
          />

          {/* Date Picker Field */}
          <TouchableOpacity
            onPress={showDatePicker}
            className="bg-white p-4 rounded-xl text-base mb-5 border border-slate-200 shadow-sm justify-center"
          >
            <Text className={date ? "text-black" : "text-slate-400"}>
              {date ? format(date, "yyyy-MM-dd") : "Select Date"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={saveExpense}
            activeOpacity={0.8}
            className="bg-blue-600 py-4 rounded-xl items-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Save Expense</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
