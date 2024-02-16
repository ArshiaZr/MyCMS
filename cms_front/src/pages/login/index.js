import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import Form from "@/components/Form";
import styles from "../../styles/login/Login.module.scss";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";
import SubLink from "@/components/SubLink";
import BulletWithText from "@/components/BulletWithText";
import Button from "@/components/Button";
import { useAppStatesContext } from "@/contexts/States";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Login() {
  const [inputs, setInputs] = useState({});

  const { push } = useRouter();

  const { addAlert, setToken, token, setAdmin } = useAppStatesContext();

  useEffect(() => {
    if (token !== "" || localStorage.getItem("auth token")) {
      push("/");
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/accounts/login`,
        inputs
      )
      .then(async (res) => {
        if (res.data.token) {
          setToken(res.data.token);
          addAlert({
            message: "Logged in successfully.",
            type: "success",
            time: 3000,
          });
          let token = res.data.token;
          let admin = res.data.admin;

          let roleRes = await axios
            .get(
              `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/roles/${admin.role}`,
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then((res1) => {
              if (res1.data.role) {
                admin.permissions = res1.data.role.permissions;
                admin.employees = res1.data.role.employees;

                return {
                  permissions: admin.permissions,
                  employees: admin.employees,
                };
              }
            })
            .catch(({ response }) => {
              if (response.data && response.data.msg) {
                addAlert({
                  message: response.data.msg,
                  type: "error",
                  time: 3000,
                });
              } else {
                addAlert({
                  message: "Something went wrong.",
                  type: "error",
                  time: 3000,
                });
              }
            });
          if (roleRes && roleRes.permissions) {
            admin.permissions = roleRes.permissions;
          }
          if (roleRes && roleRes.employees) {
            admin.employees = roleRes.employees;
          }

          setAdmin(admin);
          if (inputs.remember === true) {
            localStorage.setItem("auth token", token);
            localStorage.setItem("admin", JSON.stringify(admin));
          }
          push("/");
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
    <main id={styles.loginPage}>
      <Head>
        <title>Login</title>
      </Head>

      <div className={styles.wrapper}>
        <div id={styles.icon}>
          <img src="/icons/profile.svg" />
        </div>
        <div className={styles.card}>
          <h1 className={styles.title}>Login</h1>
          <Form alignment="vertical" onSubmit={onSubmit}>
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="username"
              onChange={onChange}
              name="username"
              maxWidth="100%"
            />
            <PasswordInput
              openedIcon="/icons/EyeIcon.svg"
              lockedIcon="/icons/LockIcon.svg"
              placeholder="password"
              onChange={onChange}
              name="password"
              maxWidth="100%"
            />
            <SubLink
              link="/login/forgot"
              text="forgot password?"
              color="#93a7ff"
            />
            {/* <Captcha /> */}
            <BulletWithText
              text="remember me"
              onChange={onChange}
              name="remember"
            />
            <Button
              marginTop="1rem"
              text="login"
              type="submit"
              color="#f2f2f2"
              hoverColor="#f2f2f2"
              backgroundColor="#93a7ff"
              hoverBackgroundColor="#0045bb"
              maxWidth="100%"
            />
          </Form>
        </div>
      </div>
    </main>
  );
}
