import Head from "next/head";
import styles from "../../../styles/contents/New.module.scss";
import { useAppStatesContext } from "@/contexts/States";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import axios from "axios";

import { AiOutlinePlusSquare, AiOutlineLeft } from "react-icons/ai";

import EditableTextInput from "@/components/EditableTextInput";
import Form from "@/components/Form";
import Button from "@/components/Button";
import EditableMultiItem from "@/components/EditableMultiItem";
import { useRouter } from "next/router";
import Link from "next/link";
import TextArea from "@/components/TextArea";

import getConfig from "next/config";
import { interprets } from "../../../../constants";
import Select from "@/components/Select";
import EditableMultiItem2 from "@/components/EditableMultiItem2";
const { publicRuntimeConfig } = getConfig();

export default function NewContent() {
  const router = useRouter();
  const { sidebarShow, getAdmin } = useAppStatesContext();

  const [contentErrors, setContentErrors] = useState({});
  const [content, setContent] = useState({});

  const [contentHeaders, setContentHeaders] = useState([
    "order",
    "title",
    "detail",
    "images",
    "link",
  ]);

  const [contentData, setContentData] = useState([]);

  const { token, addAlert } = useAppStatesContext();

  const [imageOptions, setImageOptions] = useState();

  const onNewContentChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const EditContent = (e) => {
    e.preventDefault();

    let contentsToSend = [];

    for (let j = 0; j < contentData.length; j++) {
      let tmp = {};

      for (let i = 0; i < contentHeaders.length; i++) {
        tmp[contentHeaders[i]] = contentData[j][i];
      }
      contentsToSend.push(tmp);
    }

    let toSend = { ...content, contents: contentsToSend };

    console.log(toSend);

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/contents/edit/${router.query.id}`,
        toSend,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
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

  const addImage = (idxRow) => {
    let data = [...contentData];
    data[idxRow][3].push({});

    setContentData(data);
  };

  const changeImages = (index, key, value, idxRow) => {
    let data = [...contentData];
    data[idxRow][3][index][key] = value;

    setContentData(data);
  };

  const deleteImage = (index, idxRow) => {
    let data = [...contentData];
    data[idxRow][3].splice(index, 1);

    setContentData(data);
  };

  const deleteContentRow = (idxRow) => {
    let data = [...contentData];
    data.splice(idxRow, 1);

    setContentData(data);
  };

  const addContentRow = () => {
    let data = [...contentData];
    data.push(["", "", "", [], ""]);
    setContentData(data);
  };

  const getContent = () => {
    if (!router.query.id) {
      return;
    }
    axios
      .get(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/contents/${router.query.id}`
      )
      .then((res) => {
        if (res.data.content) {
          setContent(res.data.content);
          let ret = [];
          for (let i = 0; i < res.data.content.contents.length; i++) {
            let tmp = [];
            for (let j = 0; j < contentHeaders.length; j++) {
              tmp.push(res.data.content.contents[i][contentHeaders[j]]);
            }
            ret.push(tmp);
          }
          setContentData(ret);
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

  const getImages = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/files/images`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.images) {
          res.data.images = res.data.images.map((image) => image.name);

          setImageOptions(res.data.images);
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

  const onContentChange = (e, idxRow, idxCell) => {
    let data = [...contentData];
    data[idxRow][idxCell] = e.target.value;

    setContentData(data);
  };

  useEffect(() => {
    if (token) {
      getContent();
      getImages();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Edit content</title>
      </Head>
      <main
        id={styles.newContent}
        className={`${!sidebarShow ? styles.full : ""}`}
        style={{ justifyContent: "flex-start" }}
      >
        <Link href="/content-management">
          <AiOutlineLeft style={{ fontSize: "2rem" }} />
        </Link>

        <Form alignment="vertical" onSubmit={EditContent} alignItems="start">
          <EditableTextInput
            name="name"
            originalValue={content.name}
            onChange={onNewContentChange}
          />
          <div className={styles.contentsTableWrapper}>
            <h2 className={styles.title}>
              List of image and paragraph conetnts :
            </h2>
            <Table>
              <thead>
                <tr>
                  <th>
                    <div>index</div>
                  </th>

                  {contentHeaders.map((header, idx) => {
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
                {contentData.map((row, idxRow) => {
                  return (
                    <tr key={idxRow}>
                      <td>
                        <div>{idxRow + 1} </div>
                      </td>
                      {row.map((cell, idxCell) => {
                        if (idxCell == 0) {
                          return (
                            <td
                              key={`${idxRow}-${idxCell}`}
                              style={{ width: "3rem" }}
                            >
                              <Select
                                options={Array.apply(
                                  null,
                                  Array(contentData.length)
                                ).map(function (x, i) {
                                  return i + 1;
                                })}
                                title={`order_${0}`}
                                defaultValue={cell}
                                onChange={(e) => {
                                  onContentChange(e, idxRow, idxCell);
                                }}
                                backgroundColor="transparent"
                                border={true}
                              />
                            </td>
                          );
                        }
                        if (idxCell == 3) {
                          return (
                            <td key={`${idxRow}-${idxCell}`}>
                              <EditableMultiItem2
                                options={imageOptions ? imageOptions : []}
                                originalItems={cell}
                                name={`images-${idxRow}`}
                                addItem={() => addImage(idxRow)}
                                changingItems={cell}
                                idxRow={idxRow}
                                onChange={changeImages}
                                deleteItem={deleteImage}
                              />
                            </td>
                          );
                        }
                        if (idxCell == 2) {
                          return (
                            <td key={`${idxRow}-${idxCell}`}>
                              <TextArea
                                name={cell}
                                originalValue={cell}
                                onChange={(e) => {
                                  onContentChange(e, idxRow, idxCell);
                                }}
                                interprets={interprets}
                              />
                            </td>
                          );
                        }
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <EditableTextInput
                              name={cell}
                              originalValue={cell}
                              onChange={(e) => {
                                onContentChange(e, idxRow, idxCell);
                              }}
                            />
                          </td>
                        );
                      })}
                      <td>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => deleteContentRow(idxRow)}
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
            <div className={styles.addRow} onClick={addContentRow}>
              <AiOutlinePlusSquare />
            </div>
          </div>
          <Button
            text="edit"
            type="submit"
            color="#F7F8FA"
            hoverColor="#FFF"
            backgroundColor="#005FFF"
            hoverBackgroundColor="#0045bb"
            width="15rem"
          />
        </Form>
      </main>
    </>
  );
}
