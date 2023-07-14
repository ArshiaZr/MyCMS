import styles from "../../styles/components/MediaDropZone.module.scss";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDeleteOutline } from "react-icons/md";

export default function MediaDropZone({ filesInPreview, setFilesInpreview }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.map((fileUp) => {
        Object.assign(fileUp, {
          preview: URL.createObjectURL(fileUp),
        });
      });
      let tmp = [...filesInPreview].concat(acceptedFiles);
      setFilesInpreview(tmp);
    },
    [filesInPreview]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDelete = (idx) => {
    let tmp = [...filesInPreview];
    tmp.splice(idx, 1);
    setFilesInpreview(tmp);
  };

  return (
    <div className={styles.mediaDropZone}>
      <div className={styles.inputWrapper} {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag 'n' drop some images here, or click to select files</p>
        )}
      </div>
      <div className={styles.preview}>
        {filesInPreview.map((file, idx) => {
          return (
            <div key={idx} className={styles.imageWrapper}>
              <div className={styles.nameWrapper}>
                <input
                  type="text"
                  placeholder={file.name}
                  onChange={(e) => {
                    let tmp = [...filesInPreview];
                    tmp[idx].setName = e.target.value;
                    setFilesInpreview(tmp);
                  }}
                />
              </div>
              <div className={styles.delete}>
                <MdDeleteOutline onClick={onDelete} />
              </div>
              <img src={file.preview} alt={file.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
