import { tempSubPages } from "../../../../constants";
import styles from "../../../styles/pages-management/SubPage.module.scss";

export default function EachSubPage({ pageData }) {
  return;
}
export async function getStaticPaths() {
  let paths = [];
  for (let i = 0; i < tempSubPages.length; i++) {
    if (tempSubPages[i]["_id"]) {
      paths.push("/pages-management/pages/" + tempSubPages[i]["_id"]);
    }
  }
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = tempSubPages.find((page) => page["_id"] === params.id);

  const pageData = data;

  return {
    props: {
      pageData,
    },
  };
}
