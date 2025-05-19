import styles from "./Input.module.css";

const Input = ({
  label,
  type = "text",
  placeholder,
  error,
  hint,
  charCount,
  maxLength,
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          id={props.id}
          type={type}
          placeholder={placeholder}
          className={styles.input}
          maxLength={maxLength}
          {...props}
        />
        {charCount && (
          <span className={styles.charCounter}>
            {props.value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {hint && <p className={styles.inputHint}>{hint}</p>}
    </div>
  );
};

export default Input;
