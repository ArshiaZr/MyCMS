import { useAppStatesContext } from "@/contexts/States";
import { tempPages } from "../../../../constants";
import styles from "../../../styles/pages-management/Page.module.scss";
import Head from "next/head";
import TextInput from "@/components/TextInput";
import Sortby from "@/components/SortBy";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { camelToNormal, dateForm, mongoDateToString } from "@/utils/parse";
import React from "react";

import Link from "next/link";
import EditContainer from "@/components/popups/EditContainer";
import EditMedia from "@/components/popups/EditMedia";

export default function EachPage({ pageData }) {
  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const [sectionsHeader, setSectionsHeader] = useState([
    "name",
    "",
    "dateCreated",
    "dateModified",
    "",
    "files",
    "texts",
    "_id",
  ]);
  const [sectionsData, setSectionsData] = useState([]);
  const [sectionsDataStored, setSectionsDataStored] = useState([]);
  const [sections, setSections] = useState([]);

  const [sectionsViewToggle, setSectionsViewToggle] = useState([]);

  const displayHeaderIndex = 5;

  const [editContainerToggle, setEditContainerToggle] = useState(false);
  const [currentContentsMeta, setCurrentContentsMeta] = useState();

  const [editMediaToggle, setEditMediaToggle] = useState(false);

  useEffect(() => {
    //Temp
    setSections(pageData.sections);

    let sec = pageData.sections;
    let ret = [];
    for (let i = 0; i < sec.length; i++) {
      let tmp = [];
      for (let j = 0; j < sectionsHeader.length; j++) {
        tmp.push(sec[i][sectionsHeader[j]]);
      }
      ret.push(tmp);
    }
    setSectionsDataStored(ret);
    setSectionsData(ret);
    setSectionsViewToggle(new Array(ret.length).fill(false));
  }, [pageData.sections]);

  const [sortSelected, SetSortSelected] = useState("");

  const onActiveToggle = (isActive) => {
    // TODO: to server
    if (isActive != pageData.isActive) {
      pageData.isActive = isActive;
    }
  };

  const onCancelChangesClicked = (idxRow) => {
    //TODO: alert, cleanup the changes
    let tmp = [...sectionsViewToggle];
    tmp[idxRow] = false;
    setSectionsViewToggle(tmp);
  };

  const onSaveChangesClicked = (idxRow) => {};

  const onPageDeleteClicked = () => {
    // TODO: to server
  };

  const deleteSection = (sectionID) => {};

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = employeesDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setEmployeesData(tmp);
  };

  const findFirstPreview = (file) => {
    while (file != null) {
      if (file.kind == "single") {
        if (file.format == "video") {
          return (
            <video muted playsInline autoPlay preload="none">
              <source src={file.link} type="video/mp4" />
            </video>
          );
        } else {
          return <img src={file.link} alt="" loading="lazy" />;
        }
      }

      for (let i = 0; i < file.files.length; i++) {
        return findFirstPreview(file.files[i]);
      }
    }
    return <div className={styles.empty}></div>;
  };

  return (
    <>
      <Head>
        <title>Pages Management | {pageData.name.toString()}</title>
      </Head>

      <main id={styles.page} className={`${!sidebarShow ? styles.full : ""}`}>
        <EditContainer
          toggle={editContainerToggle}
          setToggle={setEditContainerToggle}
          contentsMeta={currentContentsMeta}
          setContentsMeta={setCurrentContentsMeta}
          sections={sectionsData}
          setEditMediaToggle={setEditMediaToggle}
        />
        <EditMedia
          toggle={editMediaToggle}
          setToggle={setEditMediaToggle}
          contentsMeta={currentContentsMeta}
          sections={sectionsData}
          setEditMediaToggle={setEditMediaToggle}
          setSections={setSectionsData}
        />
        <div className={styles.pageContentWrapper}>
          <h2 className={styles.title}>
            <Link href="/pages-management">Pages</Link> &gt;{" "}
            {pageData.name.toString()}
          </h2>
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
              <div className={styles.pageStatusWrapper}>
                <div className={styles.status}>
                  page status
                  <div className={styles.container}>
                    <div
                      className={`${styles.active} ${
                        pageData.isActive ? styles.selected : ""
                      }`}
                      onClick={() => {
                        onActiveToggle(true);
                      }}
                    >
                      active
                    </div>
                    <div
                      className={`${styles.inactive} ${
                        !pageData.isActive ? styles.selected : ""
                      }`}
                      onClick={() => {
                        onActiveToggle(false);
                      }}
                    >
                      inactive
                    </div>
                  </div>
                </div>
                <button
                  className={styles.deletePage}
                  onClick={() => {
                    onPageDeleteClicked();
                  }}
                >
                  delete page
                </button>
              </div>
              <div className={styles.sortFilterWrapper}>
                <Sortby
                  sortSelected={sortSelected}
                  SetSortSelected={SetSortSelected}
                  options={["", "name", "dateModified", "kind", "dateCreated"]}
                />
              </div>
            </div>
          </div>
          <Table>
            <caption>list of sections</caption>
            <thead>
              <tr>
                {sectionsHeader
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
              {sectionsData.map((row, idxRow) => {
                return (
                  <React.Fragment key={idxRow}>
                    <tr>
                      <td style={{ width: "15%" }}>
                        <div className={styles.nameWrapper}>
                          <div className={styles.name}>{row[0]}</div>

                          <div className={styles.detail}>
                            {row[5].length} contents
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "35%" }}>
                        <div className={styles.dataManipulation}>
                          <button
                            className={`${styles.viewContent} ${
                              !sectionsViewToggle[idxRow] ? styles.show : ""
                            }`}
                            onClick={() => {
                              let tmp = [...sectionsViewToggle];
                              tmp[idxRow] = true;
                              setSectionsViewToggle(tmp);
                            }}
                          >
                            view content
                          </button>

                          <div
                            className={`${styles.saveChangesWrapper} ${
                              sectionsViewToggle[idxRow] ? styles.show : ""
                            }`}
                          >
                            <button
                              className={styles.saveChanges}
                              onClick={() => {
                                onSaveChangesClicked(idxRow);
                              }}
                            >
                              save changes
                            </button>
                            <button
                              className={styles.cancel}
                              onClick={() => {
                                onCancelChangesClicked(idxRow);
                              }}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <div className={styles.datecreated}>
                          {dateForm(mongoDateToString(row[2]))}
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <div className={styles.dateModified}>
                          {dateForm(mongoDateToString(row[3]))}
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
                            <img
                              src="/icons/delete1IconGray.svg"
                              alt="delete"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr
                      style={{
                        display: sectionsViewToggle[idxRow]
                          ? "table-row"
                          : "none",
                      }}
                    >
                      <td
                        style={{
                          paddingTop: "0",
                          paddingBottom: "0",
                          verticalAlign: "top",
                        }}
                        colSpan={2}
                      >
                        <div className={styles.mediaContainer}>
                          <div className={styles.filter}>
                            <button className={styles.each}>
                              <img src="/icons/FileTypes/documentIconPrimary.svg" />
                              <img src="/icons/FileTypes/documentIconLight.svg" />
                            </button>
                            <button className={styles.each}>
                              <img src="/icons/FileTypes/imageIconPrimary.svg" />
                              <img src="/icons/FileTypes/imageIconLight.svg" />
                            </button>
                            <button className={styles.each}>
                              <img src="/icons/FileTypes/videoIconPrimary.svg" />
                              <img src="/icons/FileTypes/videoIconLight.svg" />
                            </button>
                            <button className={styles.each}>
                              <img src="/icons/FileTypes/audioIconPrimary.svg" />
                              <img src="/icons/FileTypes/audioIconLight.svg" />
                            </button>
                          </div>
                          <div className={styles.contents}>
                            {row[5]
                              .sort((fileA, fileB) => fileA.order - fileB.order)
                              .map((eachFile, idxContent) => {
                                return (
                                  <div
                                    key={idxContent}
                                    className={styles.eachContent}
                                  >
                                    <div className={styles.previewWrapper}>
                                      {findFirstPreview(eachFile)}
                                      {eachFile.kind != "single" || (
                                        <div className={styles.overlay}>
                                          <button
                                            className={styles.edit}
                                            onClick={() => {
                                              setCurrentContentsMeta({
                                                indexContent: [idxContent],
                                                indexMedia: [5],
                                                indexSection: [idxRow],
                                              });
                                              setEditMediaToggle(true);
                                            }}
                                          >
                                            <img src="/icons/edit2IconPrimary.svg" />
                                            <img src="/icons/edit2IconLight.svg" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <div className={styles.contentDetails}>
                                      <div className={styles.contentTitle}>
                                        {eachFile.title}
                                      </div>
                                      <div className={styles.contentKind}>
                                        Kind: {eachFile.kind}{" "}
                                        {eachFile.format || eachFile.format}
                                      </div>
                                      {eachFile.kind == "single" || (
                                        <button
                                          className={styles.editContent}
                                          onClick={() => {
                                            setCurrentContentsMeta({
                                              indexContent: [idxContent],
                                              indexMedia: 5,
                                              indexSection: idxRow,
                                            });
                                            setEditContainerToggle(true);
                                          }}
                                        >
                                          edit slider contents
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </td>
                      <td colSpan={3} style={{ verticalAlign: "top" }}>
                        <div className={styles.textContainer}>
                          <div className={styles.containerTitle}>edit text</div>
                          <div className={styles.innerWrapper}>
                            {row[6].map((eachText, idxText) => {
                              return (
                                <button
                                  key={idxText}
                                  className={styles.textPreview}
                                >
                                  {eachText < 20
                                    ? eachText
                                    : `${eachText.slice(0, 17)}...`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      </main>
    </>
  );
}
export async function getStaticPaths() {
  let paths = [];
  for (let i = 0; i < tempPages.length; i++) {
    if (tempPages[i]["_id"]) {
      paths.push("/pages-management/pages/" + tempPages[i]["_id"]);
    }
  }
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = tempPages.find((page) => page["_id"] === params.id);

  const pageData = data;

  return {
    props: {
      pageData,
    },
  };
}
