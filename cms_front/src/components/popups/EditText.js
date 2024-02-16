import { useEffect, useState } from "react";
import styles from "../../styles/popups/EditText.module.scss";
import { useAppStatesContext } from "@/contexts/States";

export default function EditText({
  toggle,
  setToggle,
  contentsMeta,
  sections,
  setSections,
}) {
  const [inputs, setInputs] = useState({
    title: "",
    order: 0,
    caption: "",
    link: "",
    format: "",
    buttons: [],
  });

  const [titleOrderEditToggle, setTitleOrderEditToggle] = useState(false);
  const [captionEditToggle, setCaptionEditToggle] = useState(false);
  const [buttonsEditToggles, setButtonsEditToggles] = useState([]);

  const [titleTemp, setTitleTemp] = useState("");
  const [captionTemp, setCaptionTemp] = useState("");
  const [orderTemp, setOrderTemp] = useState(0);
  const [buttonsEditTemp, setButtonsEditTemp] = useState([]);

  const { addAlert } = useAppStatesContext();

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const getActualContent = (depth = null) => {
    if (contentsMeta.indexContent.length == 1) {
      if (depth == 0) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia];
      }
      return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
        contentsMeta.indexContent[0]
      ];
    } else if (contentsMeta.indexContent.length == 2) {
      if (depth == 0) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia];
      }
      if (depth == 1) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
          contentsMeta.indexContent[0]
        ].files;
      }
      return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
        contentsMeta.indexContent[0]
      ].files[contentsMeta.indexContent[1]];
    } else {
      if (depth == 0) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia];
      }
      if (depth == 1) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
          contentsMeta.indexContent[0]
        ].files;
      }
      if (depth == 2) {
        return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
          contentsMeta.indexContent[0]
        ].files[contentsMeta.indexContent[1]].files;
      }
      return sections[contentsMeta.indexSection][contentsMeta.indexMedia][
        contentsMeta.indexContent[0]
      ].files[contentsMeta.indexContent[1]].files[contentsMeta.indexContent[2]];
    }
  };

  const onEditSubmit = () => {
    // convert inputs.order to int
    console.log(inputs);
  };

  useEffect(() => {
    if (contentsMeta) {
      let tempInputs = getActualContent();
      if (tempInputs.buttons) {
        setButtonsEditToggles(
          [...Array(tempInputs.buttons.length)].fill(false)
        );
        setButtonsEditTemp(
          [...Array(tempInputs.buttons.length)].fill({
            content: "",
            hasIcon: null,
            link: "",
          })
        );
      }

      setInputs({
        title: tempInputs.title,
        order: tempInputs.order,
        caption: tempInputs.caption,
        link: tempInputs.link,
        format: tempInputs.format,
        buttons: tempInputs.buttons,
      });
    }
  }, [contentsMeta, sections]);

  const onAddButtonClicked = () => {
    let buttonsTemp = [...inputs.buttons];
    buttonsTemp.push({ hasIcon: null, link: "", content: "" });

    let buttonsTemp1 = [...buttonsEditTemp];
    buttonsTemp1.push({ hasIcon: null, link: "", content: "" });

    setButtonsEditTemp(buttonsTemp1);

    setInputs({ ...inputs, buttons: buttonsTemp });
  };

  return (
    <main id={styles.editMedia} className={toggle ? styles.open : ""}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>Edit </div>
          <div
            className={styles.close}
            onClick={() => {
              setToggle(false);
            }}
          >
            <img src="/icons/closeIconDark.svg" alt="close" />
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <div className={styles.grayContainer}>
              <div
                className={`${styles.editContainer} ${
                  titleOrderEditToggle ? styles.editing : ""
                }`}
              >
                <button
                  className={styles.edit}
                  onClick={() => {
                    setTitleTemp(inputs.title);
                    setOrderTemp(inputs.order);
                    setTitleOrderEditToggle(!titleOrderEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
                <button
                  className={styles.save}
                  onClick={() => {
                    setInputs({
                      ...inputs,
                      title: titleTemp,
                      order: orderTemp,
                    });
                    setTitleOrderEditToggle(!titleOrderEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
                <button
                  className={styles.cancel}
                  onClick={() => {
                    setTitleOrderEditToggle(!titleOrderEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
              </div>
              <div
                className={`${styles.contentTitle} ${
                  titleOrderEditToggle ? styles.editing : ""
                }`}
              >
                <p>{inputs.title}</p>
                <input
                  type="text"
                  placeholder="title"
                  name="title"
                  onChange={(e) => {
                    setTitleTemp(e.target.value);
                  }}
                  value={titleTemp}
                  className={styles.input}
                />
              </div>
              <div
                className={`${styles.contentOrder} ${
                  titleOrderEditToggle ? styles.editing : ""
                }`}
              >
                slide order: <p>{inputs.order}</p>{" "}
                <select
                  onChange={(e) => {
                    setOrderTemp(e.target.value);
                  }}
                  value={orderTemp}
                >
                  {contentsMeta &&
                    [
                      ...Array(
                        getActualContent(contentsMeta.indexContent.length - 1)
                          .length
                      ),
                    ].map((eachOption, idxOption) => {
                      return (
                        <option
                          selected={inputs.order === idxOption + 1}
                          disabled={inputs.order === idxOption + 1}
                          key={idxOption}
                          value={idxOption + 1}
                        >
                          {idxOption + 1}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div className={styles.grayContainer}>
              <div
                className={`${styles.editContainer} ${
                  captionEditToggle ? styles.editing : ""
                }`}
              >
                <button
                  className={styles.edit}
                  onClick={() => {
                    setCaptionTemp(inputs.caption);
                    setCaptionEditToggle(!captionEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
                <button
                  className={styles.save}
                  onClick={() => {
                    setInputs({ ...inputs, caption: captionTemp });
                    setCaptionEditToggle(!captionEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
                <button
                  className={styles.cancel}
                  onClick={() => {
                    setCaptionEditToggle(!captionEditToggle);
                  }}
                >
                  <img src="/icons/editIconPrimary.svg" />
                  <img src="/icons/editIconLight.svg" />
                </button>
              </div>
              <div className={styles.captionTitle}>caption</div>
              <div
                className={`${styles.captionText} ${
                  captionEditToggle ? styles.editing : ""
                }`}
              >
                <p>{inputs.caption}</p>
                <textarea
                  className={styles.textArea}
                  placeholder="caption"
                  name="caption"
                  onChange={(e) => {
                    setCaptionTemp(e.target.value);
                  }}
                  value={captionTemp}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.previewWrapper}>
              {inputs.link ? (
                inputs.format == "image" ? (
                  <img src={inputs.link} alt={styles.link} />
                ) : inputs.format == "video" ? (
                  <video muted playsInline autoPlay preload="none">
                    <source src={inputs.link} type="video/mp4" />
                  </video>
                ) : (
                  ""
                )
              ) : (
                <div className={styles.empty}>
                  You havn't uploaded any content yet.
                </div>
              )}
            </div>
            <div className={styles.mediaActions}>
              <label for="media" className={styles.replace} onClick={() => {}}>
                replace {inputs.format}
              </label>
              <input
                type="file"
                id="media"
                name="media"
                accept="*/*"
                onChange={(e) => {
                  const objectUrl = URL.createObjectURL(e.target.files[0]);
                  let tmp = { ...inputs };
                  tmp.link = objectUrl;
                  setInputs(tmp);
                }}
                hidden
              />

              <button
                className={styles.delete}
                onClick={() => {
                  let tmp = { ...inputs };
                  tmp.link = "";
                  setInputs(tmp);
                }}
              >
                delete {inputs.format}
              </button>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.buttonsTitle}>buttons</div>
            <div className={styles.buttonsWrapper}>
              {inputs.buttons &&
                inputs.buttons.map((eachButton, idxButton) => {
                  return (
                    <div
                      key={idxButton}
                      className={`${styles.buttonContainer} ${
                        buttonsEditToggles[idxButton] ? styles.editing : ""
                      }`}
                    >
                      <div className={styles.up}>
                        {eachButton.hasIcon === null ? (
                          <div className={styles.new}>
                            <div
                              className={styles.btn}
                              onClick={() => {
                                let tmp = [...inputs.buttons];
                                tmp[idxButton].hasIcon = false;
                                setInputs({ ...inputs, buttons: tmp });
                                let tmp1 = [...buttonsEditToggles];
                                tmp1[idxButton] = true;
                                setButtonsEditToggles(tmp1);
                              }}
                            >
                              add text
                            </div>
                            or
                            <div
                              className={styles.btn}
                              onClick={() => {
                                let tmp = [...inputs.buttons];
                                tmp[idxButton].hasIcon = true;
                                setInputs({ ...inputs, buttons: tmp });

                                let tmp2 = [...buttonsEditTemp];
                                tmp2[idxButton].hasIcon = true;
                                setButtonsEditTemp(tmp2);

                                let tmp1 = [...buttonsEditToggles];
                                tmp1[idxButton] = true;
                                setButtonsEditToggles(tmp1);
                              }}
                            >
                              upload icon
                            </div>
                          </div>
                        ) : eachButton.hasIcon == true ? (
                          <div className={styles.icon}>
                            <img src={eachButton.content} />
                            <div className={styles.uploadIcon}>
                              <label for={`icon-${idxButton}`}>
                                choose file
                              </label>
                              <input
                                type="file"
                                id={`icon-${idxButton}`}
                                name={`icon-${idxButton}`}
                                accept="image/*"
                                onChange={(e) => {
                                  const objectUrl = URL.createObjectURL(
                                    e.target.files[0]
                                  );
                                  let tmp = [...buttonsEditTemp];
                                  tmp[idxButton].content = objectUrl;
                                  setButtonsEditTemp(tmp);
                                }}
                                hidden
                              />
                            </div>
                          </div>
                        ) : (
                          <div className={styles.buttonText}>
                            <p>
                              {eachButton.content.length > 17
                                ? eachButton.content.slice(0, 17) + "..."
                                : eachButton.content}
                            </p>
                            <input
                              type="text"
                              placeholder="title"
                              name="link"
                              onChange={(e) => {
                                let tmp = [...buttonsEditTemp];
                                tmp[idxButton].content = e.target.value;
                                setButtonsEditTemp(tmp);
                              }}
                              value={buttonsEditTemp[idxButton].content}
                              className={styles.input}
                            />
                          </div>
                        )}
                        <button
                          className={styles.edit}
                          onClick={() => {
                            let tmp1 = [...buttonsEditTemp];
                            tmp1[idxButton] = { ...inputs.buttons[idxButton] };
                            setButtonsEditTemp(tmp1);

                            let tmp = [...buttonsEditToggles];
                            tmp[idxButton] = !tmp[idxButton];
                            setButtonsEditToggles(tmp);
                          }}
                        >
                          <img src="/icons/editIconPrimary.svg" />
                          <img src="/icons/editIconLight.svg" />
                        </button>
                        <button
                          className={styles.delete}
                          onClick={() => {
                            let tmp = [...inputs.buttons];
                            tmp.splice(idxButton, 1);

                            let tmp1 = [...buttonsEditTemp];
                            tmp1.splice(idxButton, 1);

                            setButtonsEditTemp(tmp1);
                            setInputs({ ...inputs, buttons: tmp });
                          }}
                        >
                          <img src="/icons/deleteIconPrimary.svg" />
                          <img src="/icons/deleteIconLight.svg" />
                        </button>
                        <button
                          className={styles.save}
                          onClick={() => {
                            if (
                              (buttonsEditTemp[idxButton].hasIcon == false ||
                                buttonsEditTemp[idxButton].hasIcon == true) &&
                              buttonsEditTemp[idxButton].content.length != 0
                            ) {
                              let buttons = inputs.buttons;
                              buttons[idxButton] = buttonsEditTemp[idxButton];
                              // setInputs({ ...inputs, buttons });

                              let tmp = [...buttonsEditToggles];
                              tmp[idxButton] = false;
                              setButtonsEditToggles(tmp);
                            } else {
                              addAlert({
                                message:
                                  "You have to specify the content of the button.",
                                type: "error",
                                time: 3000,
                              });
                            }
                          }}
                        >
                          <img src="/icons/editIconPrimary.svg" />
                          <img src="/icons/editIconLight.svg" />
                        </button>
                        <button
                          className={styles.cancel}
                          onClick={() => {
                            let tmp = [...buttonsEditToggles];
                            tmp[idxButton] = false;
                            setButtonsEditToggles(tmp);
                          }}
                        >
                          <img src="/icons/deleteIconPrimary.svg" />
                          <img src="/icons/deleteIconLight.svg" />
                        </button>
                      </div>

                      <div className={styles.down}>
                        <div className={styles.shownLink}>
                          <p>{eachButton.link}</p>
                        </div>
                        <div className={styles.editingLink}>
                          <input
                            type="text"
                            placeholder="link"
                            name="link"
                            onChange={(e) => {
                              let tmp = [...buttonsEditTemp];
                              tmp[idxButton].link = e.target.value;
                              setButtonsEditTemp(tmp);
                            }}
                            value={buttonsEditTemp[idxButton].link}
                            className={styles.input}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              className={styles.addButton}
              onClick={() => onAddButtonClicked()}
            >
              add button
            </button>
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
    </main>
  );
}
