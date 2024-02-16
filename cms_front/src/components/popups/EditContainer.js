import { useEffect, useState } from "react";
import styles from "../../styles/popups/EditContainer.module.scss";

export default function EditContainer({
  toggle,
  setToggle,
  contentsMeta,
  setContentsMeta,
  sections,
  setEditMediaToggle,
}) {
  const [inputs, setInputs] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    role: "",
    enabled: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    role: "",
    enabled: "",
  });

  // const [indexSection, setIndexSection] = useState(null);
  // const [indexContent, setIndexContent] = useState(null);
  // const [indexMedia, setIndexMedia] = useState(null);
  const [contents, setContents] = useState({});

  const [openSecondSlider, setOpenSecondSlider] = useState(false);
  const [secondSliderIndex, setSecondSliderIndex] = useState(0);

  // const easyAccess = () => {
  //   if (indexSection !== null) {
  //     return {
  //       section: sections[indexSection],
  //       media: sections[indexSection][indexMedia],
  //       contents: sections[indexSection][indexMedia][indexContent],
  //     };
  //   }
  //   return {
  //     section: {},
  //     media: {},
  //     contents: {},
  //   };
  // };

  useEffect(() => {
    if (contentsMeta) {
      // setIndexContent(contentsMeta.indexContent);
      // setIndexSection(contentsMeta.indexSection);
      // setIndexMedia(contentsMeta.indexMedia);
      setContents(
        sections[contentsMeta.indexSection][contentsMeta.indexMedia][
          contentsMeta.indexContent[0]
        ]
      );
      // setOpenSecondSlider(false);
    }
  }, [contentsMeta]);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onEditSubmit = () => {
    console.log(inputs);
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
    <main id={styles.editContainer} className={toggle ? styles.open : ""}>
      <div
        className={`${styles.wrapper} ${
          openSecondSlider ? styles.secondOpen : ""
        }`}
      >
        <div className={styles.mainContainer}>
          <div className={styles.header}>
            <div className={styles.title}>
              <span style={{ textTransform: "none" }}>{contents.title}</span>
            </div>
            <div
              className={styles.close}
              onClick={() => {
                setToggle(false);
              }}
            >
              <img src="/icons/closeIconDark.svg" alt="close" />
            </div>
          </div>
          <div className={styles.contentsContainer}>
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
            <div className={styles.contentsWrapper}>
              {contents.files &&
                contents.files
                  .sort((fileA, fileB) => fileA.order - fileB.order)
                  .map((eachFile, idxContent) => {
                    return (
                      <div key={idxContent} className={styles.eachContent}>
                        <div className={styles.previewWrapper}>
                          {findFirstPreview(eachFile)}
                          {eachFile.kind != "single" || (
                            <div className={styles.overlay}>
                              <button
                                className={styles.edit}
                                onClick={() => {
                                  setContentsMeta({
                                    ...contentsMeta,
                                    indexContent: [
                                      contentsMeta.indexContent[0],
                                      idxContent,
                                    ],
                                  });
                                  setEditMediaToggle(true);
                                }}
                              >
                                <img src="/icons/edit2IconPrimary.svg" />
                                <img src="/icons/edit2IconLight.svg" />
                              </button>
                              <button className={styles.delete}>
                                <img src="/icons/delete2IconPrimary.svg" />
                                <img src="/icons/delete2IconLight.svg" />
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
                                setSecondSliderIndex(idxContent);
                                setOpenSecondSlider(true);
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
          <div className={styles.actions}>
            <button
              className={styles.addUser}
              onClick={() => {
                onEditSubmit();
              }}
            >
              update
            </button>
            <button
              className={styles.cancel}
              onClick={() => {
                setToggle(false);
              }}
            >
              cancel
            </button>
          </div>
        </div>
        <div className={`${styles.mainContainer} ${styles.container1}`}>
          <div className={styles.header}>
            <div className={styles.title}>
              <span
                style={{ textTransform: "none", cursor: "pointer" }}
                onClick={() => {
                  setOpenSecondSlider(false);
                }}
              >
                {contents.title}
              </span>{" "}
              &gt;{" "}
              <span style={{ textTransform: "none" }}>
                {contents.files &&
                  contents.files[secondSliderIndex] &&
                  contents.files[secondSliderIndex].title}
              </span>
            </div>
            <div
              className={styles.close}
              onClick={() => {
                setToggle(false);
              }}
            >
              <img src="/icons/closeIconDark.svg" alt="close" />
            </div>
          </div>
          <div className={styles.contentsContainer}>
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
            <div className={styles.contentsWrapper}>
              {contents.files &&
                contents.files[secondSliderIndex] &&
                contents.files[secondSliderIndex].files &&
                contents.files[secondSliderIndex].files
                  .sort((fileA, fileB) => fileA.order - fileB.order)
                  .map((eachFile, idxContent) => {
                    return (
                      <div key={idxContent} className={styles.eachContent}>
                        <div className={styles.previewWrapper}>
                          {findFirstPreview(eachFile)}
                          {eachFile.kind != "single" || (
                            <div className={styles.overlay}>
                              <button
                                className={styles.edit}
                                onClick={() => {
                                  setContentsMeta({
                                    ...contentsMeta,
                                    indexContent: [
                                      contentsMeta.indexContent[0],
                                      secondSliderIndex,
                                      idxContent,
                                    ],
                                  });
                                  setEditMediaToggle(true);
                                }}
                              >
                                <img src="/icons/edit2IconPrimary.svg" />
                                <img src="/icons/edit2IconLight.svg" />
                              </button>
                              <button className={styles.delete}>
                                <img src="/icons/delete2IconPrimary.svg" />
                                <img src="/icons/delete2IconLight.svg" />
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
                                setCurrentContents(eachFile);
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
          <div className={styles.actions}>
            <button
              className={styles.addUser}
              onClick={() => {
                onEditSubmit();
              }}
            >
              update
            </button>
            <button
              className={styles.cancel}
              onClick={() => {
                setToggle(false);
              }}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
