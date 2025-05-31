// app/index.jsx
import ViewExpenseScreen from "./screens/ViewExpenseScreen";

export const options = {
  title: "My Expenses", // 🔁 Change this to your desired title
};

export default function Home() {
  return <ViewExpenseScreen />;
}
