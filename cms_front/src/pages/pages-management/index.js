import Head from "next/head";
import styles from "../../styles/pages-management/PagesManagement.module.scss";
import { useState, useEffect } from "react";

import { useAppStatesContext } from "@/contexts/States";
import axios from "axios";

import getConfig from "next/config";
import TextInput from "@/components/TextInput";

import Sortby from "@/components/SortBy";

import Link from "next/link";
import { mongoDateToString } from "@/utils/parse";
import { tempPages, tempSubPages } from "../../../constants";

const { publicRuntimeConfig } = getConfig();

export default function PagesManagement() {
  const [pages, setPages] = useState(tempPages);

  const [subPages, setSubPages] = useState(tempSubPages);

  const [showPages, setShowPages] = useState(true);
  const [showSubpages, setShowSubPages] = useState(true);

  const [sortSelected, SetSortSelected] = useState("");

  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const getPages = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.employees) {
          setEmployees(res.data.employees);
          let emp = res.data.employees;
          let ret = [];
          for (let i = 0; i < emp.length; i++) {
            let tmp = [];
            for (let j = 0; j < employeesHeader.length; j++) {
              tmp.push(emp[i][employeesHeader[j]]);
            }
            ret.push(tmp);
          }
          setEmployeesDataStored(ret);
          setEmployeesData(ret);
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
  };

  useEffect(() => {
    if (token) {
      getPages();
      getAdmin();
    }
  }, [token]);

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = employeesDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setEmployeesData(tmp);
  };

  return (
    <>
      <Head>
        <title>Pages Management</title>
      </Head>

      <main
        id={styles.pagesManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.pagesContentWrapper}>
          <h2 className={styles.title}>Pages</h2>
          <div className={styles.searchAndOrderContainer}>
            <TextInput
              icon="/icons/searchIconDark.svg"
              placeholder="search"
              name="search"
              direction="reverse"
              maxWidth="83%"
              background="#fff"
              color="rgba(26, 29, 31, 0.50)"
              borderRadius="17px"
              onChange={onSearchChanged}
            />
            <Sortby
              sortSelected={sortSelected}
              SetSortSelected={SetSortSelected}
              options={["", "name", "dateModified", "kind", "dateCreated"]}
            />
          </div>
          <section className={styles.pagesSection}>
            <div className={styles.pagesContainer}>
              <h2
                className={`${styles.sectionTitle} ${
                  showPages ? styles.toggled : ""
                }`}
                onClick={() => {
                  setShowPages(!showPages);
                }}
              >
                List of Pages <img src="/icons/downIconThickDark.svg" />
              </h2>
              <div
                className={`${styles.container} ${
                  showPages ? styles.show : ""
                }`}
              >
                {pages.map((page, idx) => {
                  return (
                    <div key={`main-${idx}`} className={styles.eachPage}>
                      <div
                        className={`${styles.status} ${
                          page.isActive ? styles.active : ""
                        }`}
                      >
                        {page.isActive ? "active" : "inactive"}
                      </div>
                      <div
                        className={`${styles.imageWrapper} ${
                          page.isActive ? styles.active : ""
                        }`}
                      >
                        <img src={page.liveImage} alt={page.name} />
                        <div className={styles.overlay}>
                          <div className={styles.name}>{page.name}</div>
                        </div>
                      </div>
                      <div className={styles.control}>
                        <Link
                          href={`/pages-management/pages/${page._id}`}
                          className={styles.edit}
                          onClick={() => {}}
                        >
                          edit page
                        </Link>
                        <a
                          className={styles.live}
                          href="https://google.com"
                          target="__blank"
                        >
                          view live
                        </a>
                        <div className={styles.lastUpdate}>
                          Last Update: {mongoDateToString(page.lastUpdate).date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.pagesContainer}>
              <h2
                className={`${styles.sectionTitle} ${
                  showSubpages ? styles.toggled : ""
                }`}
                onClick={() => {
                  setShowSubPages(!showSubpages);
                }}
              >
                List of Sub-Pages <img src="/icons/downIconThickDark.svg" />
              </h2>
              <div
                className={`${styles.container} ${
                  showSubpages ? styles.show : ""
                }`}
              >
                {subPages.map((page, idx) => {
                  return (
                    <div key={`sub-${idx}`} className={styles.eachPage}>
                      <div
                        className={`${styles.status} ${
                          page.isActive ? styles.active : ""
                        }`}
                      >
                        {page.isActive ? "active" : "inactive"}
                      </div>
                      <div
                        className={`${styles.imageWrapper} ${
                          page.isActive ? styles.active : ""
                        }`}
                      >
                        <img src={page.liveImage} alt={page.name} />
                        <div className={styles.overlay}>
                          <div className={styles.name}>{page.name}</div>
                        </div>
                      </div>
                      <div className={styles.control}>
                        <Link
                          href={`/pages-management/subpages/${page._id}`}
                          className={styles.edit}
                          onClick={() => {}}
                        >
                          edit page
                        </Link>
                        <a
                          className={styles.live}
                          href="https://google.com"
                          target="__blank"
                        >
                          view live
                        </a>
                        <div className={styles.lastUpdate}>
                          Last Update: {mongoDateToString(page.lastUpdate).date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
