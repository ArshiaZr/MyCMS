import { useRouter } from "next/router";

export default function EachLog() {
  const router = useRouter();
  return <p>{router.query.id}</p>;
}
