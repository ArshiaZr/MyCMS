import { useAppStatesContext } from "@/contexts/States";
import { tempDocuments } from "../../../constants";
import styles from "../../styles/files-management/Documents.module.scss";
import Head from "next/head";
import TextInput from "@/components/TextInput";
import Sortby from "@/components/SortBy";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { camelToNormal, dateForm, mongoDateToString } from "@/utils/parse";
import React from "react";

export default function Documents({ documentsServerData }) {
  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const [documentsHeader, setDocumentsHeader] = useState([
    "name",
    "dateCreated",
    "",
    "format",
    "link",
    "_id",
  ]);
  const [documentsData, setDocumentsData] = useState([]);
  const [documentsDataStored, setDocumentsDataStored] = useState([]);
  const [document, setDocument] = useState([]);

  const displayHeaderIndex = 3;

  useEffect(() => {
    //Temp
    setDocument(documentsServerData);

    let imgs = documentsServerData;
    let ret = [];
    for (let i = 0; i < imgs.length; i++) {
      let tmp = [];
      for (let j = 0; j < documentsHeader.length; j++) {
        tmp.push(imgs[i][documentsHeader[j]]);
      }
      ret.push(tmp);
    }
    setDocumentsDataStored(ret);
    setDocumentsData(ret);
  }, [documentsServerData]);

  const [sortSelected, SetSortSelected] = useState("");
  useEffect(() => {
    const sortIndex = documentsHeader.indexOf(sortSelected);
    if (sortIndex !== -1 && sortSelected != "") {
      let tmp = [...documentsDataStored].sort((row1, row2) => {
        return row1[sortIndex].localeCompare(row2[sortIndex]);
      });
      setDocumentsDataStored(tmp);
      setDocumentsData(tmp);
    }
  }, [sortSelected, documentsHeader]);

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = documentsDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setDocumentsData(tmp);
  };

  return (
    <>
      <Head>
        <title>Files Management | Documents</title>
      </Head>

      <main
        id={styles.documents}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.documentsContentWrapper}>
          <h2 className={styles.title}>documents</h2>
          <div className={styles.searchAndOrderContainer}>
            <div className={styles.seachbar}>
              <TextInput
                icon="/icons/searchIconDark.svg"
                placeholder="search"
                name="search"
                direction="reverse"
                maxWidth="100%"
                background="#fff"
                color="rgba(26, 29, 31, 0.50)"
                borderRadius="17px"
                onChange={onSearchChanged}
              />
            </div>
            <div className={styles.sortAndFilters}>
              <div className={styles.sortFilterWrapper}>
                <Sortby
                  sortSelected={sortSelected}
                  SetSortSelected={SetSortSelected}
                  options={["", "name", "dateCreated"]}
                />
              </div>
            </div>
          </div>
          <Table>
            <caption>list of documents</caption>
            <thead>
              <tr>
                {documentsHeader
                  .slice(0, displayHeaderIndex)
                  .map((header, idx) => {
                    return (
                      <th key={`head-${idx}`}>
                        <div>{camelToNormal(header)}</div>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {documentsData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <a
                        href={row[4]}
                        target="_blank"
                        className={styles.nameWrapper}
                      >
                        <div className={styles.type}>
                          <img src="/icons/FileTypes/documentIconPrimary.svg" />
                        </div>

                        <div className={styles.name}>{row[0]}</div>
                      </a>
                    </td>
                    <td>
                      <div className={styles.datecreated}>
                        {dateForm(mongoDateToString(row[1]))}
                      </div>
                    </td>
                    <td style={{ width: "10%" }}>
                      <div className={styles.action}>
                        <button
                          type="button"
                          onClick={() => {
                            deleteSection(row[5]);
                          }}
                        >
                          <img src="/icons/delete1IconGray.svg" alt="delete" />
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

export async function getStaticProps() {
  const data = tempDocuments;

  const documentsServerData = data;

  return {
    props: {
      documentsServerData,
    },
  };
}
