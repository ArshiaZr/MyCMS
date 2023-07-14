import Form from "@/components/Form";
import styles from "../../styles/Complete.module.scss";
import Head from "next/head";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";
import axios from "axios";
import Button from "@/components/Button";
import MediaDropZone from "@/components/MediaDropZone";
import { useEffect, useState } from "react";
import { useAppStatesContext } from "@/contexts/States";
import { useRouter } from "next/router";

export default function Complete() {
  const router = useRouter();
  const [filesInPreview, setFilesInpreview] = useState([]);
  const [inputs, setInputs] = useState({});

  const { getAdmin, addAlert, token, admin } = useAppStatesContext();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAdmin();
    if (token === "" && !localStorage.getItem("auth token")) {
      router.push("/login");
    } else if (admin.verified) {
      router.push("/");
    }
  }, [admin, token]);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    filesInPreview.length;
    if (filesInPreview.length > 1) {
      addAlert({
        message: "You can not upload more than 1 image.",
        type: "error",
        time: 3000,
      });
      return;
    }

    for (let i = 0; i < filesInPreview.length; i++) {
      formData.append("image", filesInPreview[i]);
    }

    let keys = Object.keys(inputs);

    for (let i = 0; i < keys.length; i++) {
      formData.append(keys[i], inputs[keys[i]]);
    }

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/accounts/complete`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data && res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          setFilesInpreview([]);
          router.push("/");
          getAdmin();
        }
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data && response.data.errors) {
            setErrors(response.data.errors);
          }
          if (response.data && response.data.msg) {
            addAlert({
              message: response.data.msg,
              type: "error",
              time: 3000,
            });
          }
        }
      });
  };

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  return (
    <main id={styles.complete}>
      <Head>
        <title>Complete your account</title>
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Complete your account</h1>
          <Form align="horizontal" onSubmit={onSubmit}>
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="firstname"
              onChange={onChange}
              name="firstname"
            />
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="lastname"
              onChange={onChange}
              name="lastname"
            />
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="phone number"
              onChange={onChange}
              name="phonenumber"
            />
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="email"
              onChange={onChange}
              name="email"
            />
            <PasswordInput
              openedIcon="/icons/EyeIcon.svg"
              lockedIcon="/icons/LockIcon.svg"
              placeholder="new password"
              onChange={onChange}
              name="newpassword"
            />
            <MediaDropZone
              filesInPreview={filesInPreview}
              setFilesInpreview={setFilesInpreview}
            />
            <Button
              marginTop="1rem"
              text="complete"
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
