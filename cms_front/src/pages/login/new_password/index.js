import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import Form from "@/components/Form";
import styles from "../../../styles/login/NewPass.module.scss";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import { useAppStatesContext } from "@/contexts/States";
import { validateEmail } from "@/utils/validators";

export default function Forgot() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  const { push } = useRouter();

  const { addAlert, resetToken, token } = useAppStatesContext();

  useEffect(() => {
    if (token !== "" || localStorage.getItem("auth token")) {
      push("/");
    }
    if (resetToken === "") {
      push("/login");
    }
  }, [resetToken, token]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputs.new_password) {
      addAlert({
        message: "New password is required.",
        type: "error",
        time: 3000,
      });
      return;
    }
    if (!inputs.confirm) {
      addAlert({
        message: "Password confirmation is required.",
        type: "error",
        time: 3000,
      });
      return;
    }
    if (inputs.new_password !== inputs.confirm) {
      addAlert({
        message: "The inputs are not match.",
        type: "error",
        time: 3000,
      });
      return;
    }
    let decoded = decodeURIComponent(resetToken);
    decoded = decoded.split(" ");
    inputs.token = decoded[1];
    inputs.username = decoded[0];
    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/accounts/new-password`,
        inputs
      )
      .then((res) => {
        if (res.data) {
          addAlert({ message: res.data.msg, type: "success", time: 3000 });
          push("/login");
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.errors) {
          setErrors(response.data.errors);
        } else if (response.data && response.data.msg) {
          addAlert({ message: response.data.msg, type: "error", time: 3000 });
        }
      });
  };
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  return (
    <main id={styles.newPassPage}>
      <Head>
        <title>Forgot Password</title>
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>New Password</h1>
          <Form align="horizontal" onSubmit={onSubmit}>
            <PasswordInput
              openedIcon="/icons/EyeIcon.svg"
              lockedIcon="/icons/LockIcon.svg"
              placeholder="enter your new password"
              onChange={onChange}
              name="new_password"
              error={errors.new_password}
            />
            <PasswordInput
              openedIcon="/icons/EyeIcon.svg"
              lockedIcon="/icons/LockIcon.svg"
              placeholder="rewrite your new password"
              onChange={onChange}
              name="confirm"
            />
            <Button
              marginTop="1rem"
              text="send"
              type="submit"
              color="#F7F8FA"
              hoverColor="#FFF"
              backgroundColor="#005FFF"
              hoverBackgroundColor="#0045bb"
            />
          </Form>
        </div>
      </div>
    </main>
  );
}
