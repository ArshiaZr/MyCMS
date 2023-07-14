import styles from "../../styles/components/EditableMultiItem.module.scss";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";

import { useEffect, useRef } from "react";
import Select from "../Select";

export default function EditableMultiItem({
  originalItems = [],
  name = "",
  error = "",
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
                title={`permission_${0}`}
                defaultValue={item}
                onChange={(e) =>
                  onChange(idx, e.target.value, originalItems, idxRow)
                }
                backgroundColor="transparent"
              />
              <div
                className={styles.delete}
                onClick={() => deleteItem(idx, originalItems, idxRow)}
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
      {/* <div
          className={styles.iconWrapper}
          onClick={onEditClick}
          style={{
            display: `${
              ref.current && originalItems === ref.current.value
                ? "none"
                : "flex"
            }`,
          }}
        >
          <AiOutlineCheckCircle />
        </div> */}
    </div>
  );
}
