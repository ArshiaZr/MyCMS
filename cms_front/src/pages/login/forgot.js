import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import Form from "@/components/Form";
import styles from "../../styles/login/Forgot.module.scss";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useAppStatesContext } from "@/contexts/States";
import { validateEmail } from "@/utils/validators";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Forgot() {
  const [inputs, setInputs] = useState({});

  const { push } = useRouter();

  const { addAlert, setToken, token } = useAppStatesContext();

  useEffect(() => {
    if (token !== "" || localStorage.getItem("auth token")) {
      push("/");
    }
  }, [token]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputs.username && validateEmail(inputs.username)) {
      inputs.email = inputs.username;
      delete inputs["username"];
    } else {
      if (inputs.email) {
        delete inputs["email"];
      }
    }
    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/accounts/forgot-password`,
        inputs
      )
      .then((res) => {
        if (res.data) {
          addAlert({ message: res.data.msg, type: "success", time: 3000 });
        }
      })
      .catch(({ response }) => {
        if (response.data) {
          addAlert({ message: response.data.msg, type: "error", time: 3000 });
        }
      });
  };
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  return (
    <main id={styles.forgotPage}>
      <Head>
        <title>Forgot Password</title>
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>forgot password?</h1>
          <Form align="horizontal" onSubmit={onSubmit}>
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="username/email"
              onChange={onChange}
              name="username"
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
