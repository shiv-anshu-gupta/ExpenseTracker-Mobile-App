// app/_layout.jsx
import { Stack } from "expo-router";
import "../global.css";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Shivanshu App" }} />
      <Stack.Screen name="add-expense" options={{ title: "Add Expense" }} />
    </Stack>
  );
}
