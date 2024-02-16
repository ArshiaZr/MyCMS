import { useAppStatesContext } from "@/contexts/States";
import { tempAudios } from "../../../constants";
import styles from "../../styles/files-management/Audios.module.scss";
import Head from "next/head";
import TextInput from "@/components/TextInput";
import Sortby from "@/components/SortBy";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { camelToNormal, dateForm, mongoDateToString } from "@/utils/parse";
import React from "react";

export default function Audios({ audiosServerData }) {
  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const [audiosHeader, setAudiosHeader] = useState([
    "name",
    "dateCreated",
    "",
    "format",
    "link",
    "_id",
  ]);
  const [audiosData, setAudiosData] = useState([]);
  const [audiosDataStored, setAudiosDataStored] = useState([]);
  const [audio, setAudio] = useState([]);

  const displayHeaderIndex = 3;

  useEffect(() => {
    //Temp
    setAudio(audiosServerData);

    let imgs = audiosServerData;
    let ret = [];
    for (let i = 0; i < imgs.length; i++) {
      let tmp = [];
      for (let j = 0; j < audiosHeader.length; j++) {
        tmp.push(imgs[i][audiosHeader[j]]);
      }
      ret.push(tmp);
    }
    setAudiosDataStored(ret);
    setAudiosData(ret);
  }, [audiosServerData]);

  const [sortSelected, SetSortSelected] = useState("");
  useEffect(() => {
    const sortIndex = audiosHeader.indexOf(sortSelected);
    if (sortIndex !== -1 && sortSelected != "") {
      let tmp = [...audiosDataStored].sort((row1, row2) => {
        return row1[sortIndex].localeCompare(row2[sortIndex]);
      });
      setAudiosDataStored(tmp);
      setAudiosData(tmp);
    }
  }, [sortSelected, audiosHeader]);

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = audiosDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setAudiosData(tmp);
  };

  return (
    <>
      <Head>
        <title>Files Management | Audios</title>
      </Head>

      <main id={styles.audios} className={`${!sidebarShow ? styles.full : ""}`}>
        <div className={styles.audiosContentWrapper}>
          <h2 className={styles.title}>audios</h2>
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
            <caption>list of audios</caption>
            <thead>
              <tr>
                {audiosHeader
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
              {audiosData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <a
                        href={row[4]}
                        target="_blank"
                        className={styles.nameWrapper}
                      >
                        <div className={styles.type}>
                          <img src="/icons/FileTypes/audioIconPrimary.svg" />
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
  const data = tempAudios;

  const audiosServerData = data;

  return {
    props: {
      audiosServerData,
    },
  };
}
