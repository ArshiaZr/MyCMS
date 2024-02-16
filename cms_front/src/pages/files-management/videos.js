import { useAppStatesContext } from "@/contexts/States";
import { tempVideos } from "../../../constants";
import styles from "../../styles/files-management/Videos.module.scss";
import Head from "next/head";
import TextInput from "@/components/TextInput";
import Sortby from "@/components/SortBy";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { camelToNormal, dateForm, mongoDateToString } from "@/utils/parse";
import React from "react";

export default function Videos({ videosServerData }) {
  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const [videosHeader, setVideosHeader] = useState([
    "name",
    "dateCreated",
    "",
    "format",
    "link",
    "_id",
  ]);
  const [videosData, setVideosData] = useState([]);
  const [videosDataStored, setVideosDataStored] = useState([]);
  const [videos, setVideos] = useState([]);

  const displayHeaderIndex = 3;

  useEffect(() => {
    //Temp
    setVideos(videosServerData);

    let imgs = videosServerData;
    let ret = [];
    for (let i = 0; i < imgs.length; i++) {
      let tmp = [];
      for (let j = 0; j < videosHeader.length; j++) {
        tmp.push(imgs[i][videosHeader[j]]);
      }
      ret.push(tmp);
    }
    setVideosDataStored(ret);
    setVideosData(ret);
  }, [videosServerData]);

  const [sortSelected, SetSortSelected] = useState("");
  useEffect(() => {
    const sortIndex = videosHeader.indexOf(sortSelected);
    if (sortIndex !== -1 && sortSelected != "") {
      let tmp = [...videosDataStored].sort((row1, row2) => {
        return row1[sortIndex].localeCompare(row2[sortIndex]);
      });
      setVideosDataStored(tmp);
      setVideosData(tmp);
    }
  }, [sortSelected, videosHeader]);

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = videosDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setVideosData(tmp);
  };

  return (
    <>
      <Head>
        <title>Files Management | Videos</title>
      </Head>

      <main id={styles.videos} className={`${!sidebarShow ? styles.full : ""}`}>
        <div className={styles.videosContentWrapper}>
          <h2 className={styles.title}>Videos</h2>
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
            <caption>list of videos</caption>
            <thead>
              <tr>
                {videosHeader
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
              {videosData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <a
                        href={row[4]}
                        target="_blank"
                        className={styles.nameWrapper}
                      >
                        <div className={styles.type}>
                          <img src="/icons/FileTypes/videoIconPrimary.svg" />
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
  const data = tempVideos;

  const videosServerData = data;

  return {
    props: {
      videosServerData,
    },
  };
}
