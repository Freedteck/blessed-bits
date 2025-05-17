import Sidebar from "./components/shared/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./App.module.css";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <div className={styles.container}>
      <ScrollToTop />
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
