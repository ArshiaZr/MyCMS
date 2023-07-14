import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAppStatesContext } from "@/contexts/States";

export default function Forgot() {
  const router = useRouter();

  const { setResetToken } = useAppStatesContext();

  useEffect(() => {
    setResetToken(router.query.token);
    router.push("/login/new_password");
  }, [router.query.token]);

  return <></>;
}
