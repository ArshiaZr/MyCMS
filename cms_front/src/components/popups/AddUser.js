import { useState } from "react";
import styles from "../../styles/popups/AddUser.module.scss";
import Select from "../Select";
import { tempRoles } from "../../../constants";

export default function AddUser({ toggle, setToggle }) {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onAddSubmit = () => {
    console.log(inputs);
  };
  return (
    <main id={styles.addUser} className={toggle ? styles.open : ""}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>add user</div>
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
          <input
            className={styles.username}
            type="text"
            placeholder="username *"
            name="username"
            onChange={onChange}
          />
          <input
            className={styles.password}
            type="password"
            placeholder="password *"
            name="password"
            onChange={onChange}
          />
          <input
            className={styles.password}
            type="password"
            placeholder="confirm password *"
            name="confirm_password"
            onChange={onChange}
          />

          <Select
            options={tempRoles}
            border={true}
            placeholder={"select role type: "}
            width="calc(100% / 3 - 2rem / 3)"
          />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.addUser}
            onClick={() => {
              onAddSubmit();
            }}
          >
            add user
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
