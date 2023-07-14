import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppStatesContext } from "@/contexts/States";
import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Verify() {
  const router = useRouter();

  const { setResetToken, addAlert } = useAppStatesContext();

  useEffect(() => {
    setResetToken(router.query.token);
    if (router.query.token) {
      axios
        .get(
          `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/accounts/activate/${router.query.token}`
        )
        .then(async (res) => {
          if (res.data.msg) {
            addAlert({
              message: res.data.msg,
              type: "success",
              time: 3000,
            });
            router.push("/");
          }
        })
        .catch(({ response }) => {
          if (response.data) {
            addAlert({ message: response.data.msg, type: "error", time: 3000 });
            router.push("/");
          }
        });
    }
  }, [router.query.token]);

  return <></>;
}
