import { ThemeProvider } from "./components/ModeToggle";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1>Fortune Numbers</h1>
    </ThemeProvider>
  );
}

export default App;
