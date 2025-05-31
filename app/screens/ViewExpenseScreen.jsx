import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

export default function ViewExpenseScreen() {
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadExpenses = async () => {
        try {
          const data = await AsyncStorage.getItem("expenses");
          if (data) setExpenses(JSON.parse(data));
        } catch (error) {
          console.error(error);
        }
      };
      loadExpenses();
    }, [])
  );

  const handleDelete = (index) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedExpenses = [...expenses];
              updatedExpenses.splice(index, 1);
              setExpenses(updatedExpenses);
              await AsyncStorage.setItem(
                "expenses",
                JSON.stringify(updatedExpenses)
              );
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderExpense = ({ item, index }) => (
    <Pressable
      onLongPress={() => handleDelete(index)}
      android_ripple={{ color: "#e2e8f0" }}
      className="bg-white shadow-md rounded-xl p-4 mb-4"
    >
      <Text className="text-lg font-bold text-blue-600">{item.category}</Text>
      <View className="flex-row justify-between mt-1">
        <Text className="text-base text-slate-700 font-semibold">
          ₹{item.amount}
        </Text>
        <Text className="text-sm text-gray-400">{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-4">
      <Text className="text-3xl font-extrabold text-center text-slate-800 mb-4">
        My Expenses
      </Text>

      {expenses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-500 text-base">No expenses yet.</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderExpense}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Floating Button */}
      <Link
        href="/add-expense"
        className="absolute bottom-6 right-6 bg-blue-600 rounded-full px-5 py-3 shadow-md"
      >
        <Text className="text-white font-bold text-lg">+ Add</Text>
      </Link>
    </SafeAreaView>
  );
}
