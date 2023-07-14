import Head from "next/head";
import styles from "../../../styles/contents/New.module.scss";
import { useAppStatesContext } from "@/contexts/States";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import axios from "axios";

import { AiOutlinePlusSquare } from "react-icons/ai";

import EditableTextInput from "@/components/EditableTextInput";
import Form from "@/components/Form";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import EditableMultiItem from "@/components/EditableMultiItem";
import TextArea from "@/components/TextArea";

import getConfig from "next/config";
import { interprets } from "../../../../constants";
import EditableMultiItem2 from "@/components/EditableMultiItem2";
import Select from "@/components/Select";
const { publicRuntimeConfig } = getConfig();

export default function NewContent() {
  const { sidebarShow, getAdmin } = useAppStatesContext();

  const [newContentErrors, setNewContentErrors] = useState({});
  const [newContent, setNewContent] = useState({
    contents: {
      headers: ["order", "title", "detail", "images", "link"],
      data: [],
    },
  });

  const { token, addAlert } = useAppStatesContext();

  const [imageOptions, setImageOptions] = useState();

  const onNewContentChange = (e) => {
    setNewContent({ ...newContent, [e.target.name]: e.target.value });
  };

  const createNewContent = (e) => {
    e.preventDefault();

    let contents = newContent.contents;
    let contentsToSend = [];

    for (let j = 0; j < contents.data.length; j++) {
      let tmp = {};

      for (let i = 0; i < contents.headers.length; i++) {
        tmp[contents.headers[i]] = contents.data[j][i];
      }
      contentsToSend.push(tmp);
    }

    let toSend = { ...newContent, contents: contentsToSend };

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/contents/add`,
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
    let data = [...newContent.contents.data];
    data[idxRow][3].push({});

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
    });
  };

  const changeImages = (index, key, value, idxRow) => {
    let data = [...newContent.contents.data];
    data[idxRow][3][index][key] = value;

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
    });
  };

  const deleteImage = (index, idxRow) => {
    let data = [...newContent.contents.data];
    data[idxRow][3].splice(index, 1);

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
    });
  };

  const deleteContentRow = (idxRow) => {
    let data = [...newContent.contents.data];
    data.splice(idxRow, 1);

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
    });
  };

  const addContentRow = () => {
    let data = [...newContent.contents.data];
    data.push(["", "", "", [], ""]);

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
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
    let data = [...newContent.contents.data];
    data[idxRow][idxCell] = e.target.value;

    setNewContent({
      ...newContent,
      contents: { ...newContent.contents, data: data },
    });
  };

  useEffect(() => {
    if (token) {
      getImages();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Add new content</title>
      </Head>
      <main
        id={styles.newContent}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <Form
          alignment="vertical"
          onSubmit={createNewContent}
          alignItems="start"
        >
          <TextInput
            icon="/icons/PersonIcon.svg"
            placeholder="name"
            onChange={onNewContentChange}
            name="name"
            error={newContentErrors.name}
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

                  {newContent.contents.headers.map((header, idx) => {
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
                {newContent.contents.data.map((row, idxRow) => {
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
                                  Array(newContent.contents.data.length)
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
                                name={newContent.contents.headers[idxCell]}
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
                              name={newContent.contents.headers[idxCell]}
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
            text="create"
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
