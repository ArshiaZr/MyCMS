import styles from "../../styles/components/EditableMultiItem2.module.scss";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";

import { useEffect, useRef } from "react";
import Select from "../Select";
import EditableTextInput from "../EditableTextInput";

export default function EditableMultiItem2({
  originalItems = [],
  onChange = () => {},
  addItem = () => {},
  deleteItem = () => {},
  options = [],
  changingItems = [],
  idxRow = 0,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.value) {
      ref.current.value = originalItems;
    }
  }, [ref, originalItems]);

  useEffect(() => {
    changingItems = originalItems;
  }, [originalItems]);

  return (
    <div className={styles.itemsWrapper}>
      <div className={styles.container}>
        {originalItems.map((item, idx) => {
          return (
            <div key={idx} className={styles.eachItem}>
              <Select
                options={options}
                title="image"
                defaultValue={item.image}
                onChange={(e) => onChange(idx, "image", e.target.value, idxRow)}
                backgroundColor="transparent"
                border={true}
              />
              <EditableTextInput
                name="title"
                originalValue={item.title ? item.title : "Title"}
                onChange={(e) => onChange(idx, "title", e.target.value, idxRow)}
                border={true}
              />
              <EditableTextInput
                border={true}
                name="detail"
                originalValue={item.detail ? item.detail : "Detail"}
                onChange={(e) =>
                  onChange(idx, "detail", e.target.value, idxRow)
                }
              />
              <Select
                options={Array.apply(null, Array(originalItems.length)).map(
                  function (x, i) {
                    return i + 1;
                  }
                )}
                title="order"
                showingTitle="order"
                defaultValue={item.order}
                onChange={(e) => onChange(idx, "order", e.target.value, idxRow)}
                backgroundColor="transparent"
                border={true}
                center={true}
              />
              <div
                className={styles.delete}
                onClick={() => deleteItem(idx, idxRow)}
              >
                <FiDelete />
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.addItem} onClick={() => addItem()}>
        <AiOutlinePlusSquare />
      </div>
    </div>
  );
}
