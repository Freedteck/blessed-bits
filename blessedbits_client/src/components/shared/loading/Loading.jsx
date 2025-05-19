import ClipLoader from "react-spinners/ClipLoader";
import styles from "./Loading.module.css";
const Loading = () => {
  return (
    <div className={styles.loaderWrapper}>
      <ClipLoader color="#3a86ff" size={100} />
    </div>
  );
};

export default Loading;
