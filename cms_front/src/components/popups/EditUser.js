import { useEffect, useState } from "react";
import styles from "../../styles/popups/EditUser.module.scss";
import Select from "../Select";
import { tempRoles } from "../../../constants";

export default function EditUser({ toggle, setToggle, employee }) {
  const [inputs, setInputs] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    role: "",
    enabled: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    role: "",
    enabled: "",
  });

  useEffect(() => {
    if (employee) {
      setInputs({
        username: employee.username,
        firstname: employee.firstname,
        lastname: employee.lastname,
        phonenumber: employee.phonenumber,
        email: employee.email,
        role: employee.role,
        enabled: employee.enabled,
      });
      setErrors({
        username: "",
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        role: "",
        enabled: "",
      });
    }
  }, [employee]);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onEditSubmit = () => {
    console.log(inputs);
  };
  return (
    <main id={styles.editUser} className={toggle ? styles.open : ""}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>edit user</div>
          <div
            className={styles.close}
            onClick={() => {
              setToggle(false);
            }}
          >
            <img src="/icons/closeIconDark.svg" alt="close" />
          </div>
        </div>
        <div className={styles.userInputDetails}>
          <div className={`${styles.inputWrapper} ${styles.username}`}>
            <input
              type="text"
              placeholder="username *"
              name="username"
              onChange={onChange}
              value={inputs.username}
            />
            <span
              className={styles.error}
              style={{
                display: errors.username.length > 0 ? "inline-block" : "none",
              }}
            >
              {errors.username}
            </span>
          </div>
          <div className={`${styles.inputWrapper} ${styles.firstname}`}>
            <input
              type="text"
              placeholder="firstname *"
              name="firstname"
              onChange={onChange}
              defaultValue={inputs.firstname}
            />
            <span
              className={styles.error}
              style={{
                display: errors.firstname.length > 0 ? "inline-block" : "none",
              }}
            >
              {errors.firstname}
            </span>
          </div>
          <div className={`${styles.inputWrapper} ${styles.lastname}`}>
            <input
              type="text"
              placeholder="lastname *"
              name="lastname"
              onChange={onChange}
              defaultValue={inputs.lastname}
            />
            <span
              className={styles.error}
              style={{
                display: errors.lastname.length > 0 ? "inline-block" : "none",
              }}
            >
              {errors.lastname}
            </span>
          </div>
          <div className={`${styles.inputWrapper} ${styles.phonenumber}`}>
            <input
              type="text"
              placeholder="phone no. *"
              name="phonenumber"
              onChange={onChange}
              defaultValue={inputs.phonenumber}
            />
            <span
              className={styles.error}
              style={{
                display:
                  errors.phonenumber.length > 0 ? "inline-block" : "none",
              }}
            >
              {errors.phonenumber}
            </span>
          </div>

          <div className={`${styles.inputWrapper} ${styles.email}`}>
            <input
              type="text"
              placeholder="email *"
              name="email"
              onChange={onChange}
              defaultValue={inputs.email}
            />
            <span
              className={styles.error}
              style={{
                display: errors.email.length > 0 ? "inline-block" : "none",
              }}
            >
              {errors.email}
            </span>
          </div>
          <div
            className={`${styles.enableToggle} ${
              inputs.enabled ? styles.enabled : ""
            }`}
            onClick={() => {
              setInputs({ ...inputs, enabled: !inputs.enabled });
            }}
          >
            {inputs.enabled ? "enabled" : "disabled"}
          </div>
          <Select
            options={tempRoles}
            border={true}
            placeholder={"select role type: "}
            defaultValue={inputs.role}
            title="role"
            width={"30%"}
            onChange={onChange}
          />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.addUser}
            onClick={() => {
              onEditSubmit();
            }}
          >
            edit user
          </button>
          <button
            className={styles.cancel}
            onClick={() => {
              setToggle(false);
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </main>
  );
}
