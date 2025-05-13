import Sidebar from "./components/shared/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
