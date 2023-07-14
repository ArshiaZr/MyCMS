import Head from "next/head";
import styles from "../../styles/contents/ContentManagement.module.scss";
import { useAppStatesContext } from "@/contexts/States";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import axios from "axios";

import Link from "next/link";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function ContentManagement() {
  const { sidebarShow, getAdmin } = useAppStatesContext();

  const [contentsHeader, setContentsHeader] = useState([
    "name",
    "dateCreated",
    "dateModified",
  ]);

  const [contentsData, setContentsData] = useState([]);

  const [contents, setContents] = useState([]);

  const { admin, token, addAlert } = useAppStatesContext();

  const getContents = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/contents`, {})
      .then((res) => {
        if (res.data.contents) {
          let ret = [];
          let contentTmp = res.data.contents;
          setContents(contentTmp);
          for (let i = 0; i < contentTmp.length; i++) {
            let tmp = [];
            for (let j = 0; j < contentsHeader.length; j++) {
              tmp.push(contentTmp[i][contentsHeader[j]]);
            }
            ret.push(tmp);
          }
          setContentsData(ret);
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
            message: "Something went wrong. Reload.",
            type: "error",
            time: 3000,
          });
        }
      });
  };

  const deleteContent = (idxRow) => {
    const id = contents[idxRow]._id;

    axios
      .delete(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/contents/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          getContents();
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.msg) {
          addAlert({
            message: response.data.msg,
            type: "error",
            time: 3000,
          });
        }
      });
  };

  useEffect(() => {
    if (token) {
      getContents();
      getAdmin();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Contents</title>
      </Head>
      <main
        id={styles.contentManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.addNewWrapper}>
          <Link href="/content-management/new">Add new Content</Link>
        </div>

        <div className={styles.contentsTableWrapper}>
          <h2 className={styles.title}>List of contents:</h2>
          <Table>
            <thead>
              <tr>
                <th>
                  <div>index</div>
                </th>

                {contentsHeader.map((header, idx) => {
                  return (
                    <th key={`head-${idx}`}>
                      <div>{header}</div>
                    </th>
                  );
                })}
                <th>
                  <div>Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {contentsData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <div>{idxRow + 1} </div>
                    </td>
                    {row.map((cell, idxCell) => {
                      return (
                        <td key={`${idxRow}-${idxCell}`}>
                          <div>{cell != undefined ? cell.toString() : ""}</div>
                        </td>
                      );
                    })}
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Link
                          href={`/content-management/edit/${contents[idxRow]._id}`}
                          className={styles.editButton}
                        >
                          edit
                        </Link>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => deleteContent(idxRow)}
                        >
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </main>
    </>
  );
}
