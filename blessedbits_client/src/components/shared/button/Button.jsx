import { FaArrowRight, FaUpload, FaSearch } from "react-icons/fa";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  icon,
  block = false,
  className = "",
  ...props
}) => {
  const Icon = {
    arrowRight: FaArrowRight,
    upload: FaUpload,
    search: FaSearch,
  }[icon];

  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${
        block ? styles.block : ""
      } ${className}`}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default Button;
