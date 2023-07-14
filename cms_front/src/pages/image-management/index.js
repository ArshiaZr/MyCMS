import Head from "next/head";
import styles from "../../styles/Image-management.module.scss";
import { useAppStatesContext } from "@/contexts/States";
import Form from "@/components/Form";
import { useEffect, useState, useRef } from "react";
import EditableTextInput from "@/components/EditableTextInput";
import Button from "@/components/Button";
import Table from "@/components/Table";
import axios from "axios";
import MediaDropZone from "@/components/MediaDropZone";
import path from "path";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function ImageManagement() {
  const { sidebarShow, getAdmin } = useAppStatesContext();

  const [filesInPreview, setFilesInpreview] = useState([]);

  const [addImageErrors, setAddImageErrors] = useState({});

  const [imagesHeader, setImagesHeader] = useState([
    "name",
    "dateCreated",
    "dateModified",
  ]);
  const [imagesData, setImagesData] = useState([]);

  const [images, setImages] = useState([]);

  const { token, addAlert } = useAppStatesContext();

  const [editingInput, setEditingInput] = useState({});

  const previousChangingRef = useRef(null);

  const uploadImage = (e) => {
    e.preventDefault();
    setAddImageErrors({});

    const formData = new FormData();

    for (let i = 0; i < filesInPreview.length; i++) {
      formData.append(
        filesInPreview[i].setName || path.parse(filesInPreview[i].name).name,
        filesInPreview[i]
      );
    }

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/files/images/add`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data && res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          setFilesInpreview([]);
          getImages();
        }
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data && response.data.errors) {
            setAddImageErrors(response.data.errors);
          }
          if (response.data && response.data.msg) {
            addAlert({
              message: response.data.msg,
              type: "error",
              time: 3000,
            });
          }
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
          let ret = [];
          let imagesTmp = res.data.images;
          setImages(imagesTmp);
          for (let i = 0; i < imagesTmp.length; i++) {
            let tmp = [];
            for (let j = 0; j < imagesHeader.length; j++) {
              tmp.push(imagesTmp[i][imagesHeader[j]]);
            }
            ret.push(tmp);
          }
          setImagesData(ret);
        }
      })
      .catch(({ response }) => {
        if (response && response.data && response.data.errors) {
          setNewRoleErrors(response.data.errors);
        }
        if (response && response.data && response.data.msg) {
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

  const deleteImage = (idxRow) => {
    let image_name = imagesData[idxRow][0];
    axios
      .delete(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/files/images/${image_name}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data && res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          getImages();
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

  const onChangingEditImage = (e, idxRow, idxCell) => {
    let tmp = { ...editingInput };
    if (tmp.idx !== idxRow) {
      if (previousChangingRef.current !== null && tmp.idx) {
        previousChangingRef.current.target.value = imagesData[tmp.idx][idxCell];
      }
      previousChangingRef.current = e;
      tmp = { idx: idxRow };
    }
    setEditingInput({ ...tmp, [e.target.name]: e.target.value });
  };

  const onEditImage = () => {
    let previous_name = imagesData[editingInput.idx][0];
    let new_name = editingInput.name;
    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/files/images/edit`,
        { previous_name, new_name },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data && res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          getImages();
          setEditingInput({});
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
      getImages();
      getAdmin();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Images</title>
      </Head>
      <main
        id={styles.imagesManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.addNewWrapper}>
          <h2 className={styles.title}>Add image:</h2>
          <Form alignment="horizontal" onSubmit={uploadImage}>
            <MediaDropZone
              filesInPreview={filesInPreview}
              setFilesInpreview={setFilesInpreview}
            />
            <Button
              text="add"
              type="submit"
              color="#F7F8FA"
              hoverColor="#FFF"
              backgroundColor="#005FFF"
              hoverBackgroundColor="#0045bb"
              width="15rem"
            />
          </Form>
        </div>

        <div className={styles.imagesTableWrapper}>
          <h2 className={styles.title}>List of images:</h2>
          <Table>
            <thead>
              <tr>
                <th>
                  <div>index</div>
                </th>

                {imagesHeader.map((header, idx) => {
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
              {imagesData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <div>{idxRow + 1} </div>
                    </td>
                    {row.map((cell, idxCell) => {
                      if (idxCell == 0) {
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <EditableTextInput
                              name={imagesHeader[idxCell]}
                              originalValue={cell}
                              onChange={(e) =>
                                onChangingEditImage(e, idxRow, idxCell)
                              }
                            />
                          </td>
                        );
                      }
                      return (
                        <td key={`${idxRow}-${idxCell}`}>
                          <div>{cell != undefined ? cell.toString() : ""}</div>
                        </td>
                      );
                    })}
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => onEditImage()}
                          style={{
                            display:
                              editingInput.idx === idxRow
                                ? "inline-block"
                                : "none",
                          }}
                        >
                          edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => deleteImage(idxRow)}
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
