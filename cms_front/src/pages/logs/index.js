import Head from "next/head";
import Table from "@/components/Table";
import styles from "../../styles/Logs.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppStatesContext } from "@/contexts/States";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Logs() {
  const [headersList, setHeaderList] = useState([
    "user",
    "originalUrl",
    "level",
    "success",
    "method",
    "ip",
    "timestamp",
  ]);
  const [dataList, setDataList] = useState([]);

  const [logs, setLogs] = useState([]);

  const { token, sidebarShow, addAlert } = useAppStatesContext();

  const levelColor = (text) => {
    if (text === "success") {
      return "#2fac3c";
    }

    if (text === "warn") {
      return "#f4b639";
    }

    if (text === "info") {
      return "#3d40da";
    }

    if (text === "error") {
      return "#de2d39";
    }
  };

  const getLogs = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/logs`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.logs) {
          let logs = res.data.logs;

          let ret = [];

          for (let i = 0; i < logs.length; i++) {
            if (logs[i].meta) {
              logs[i] = { ...logs[i], ...logs[i].meta };
              delete logs[i].meta;
            }
            let tmp = [];
            for (let j = 0; j < headersList.length; j++) {
              tmp.push(logs[i][headersList[j]]);
            }

            ret.push(tmp);
          }

          setLogs(logs);
          setDataList(ret);
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.msg) {
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

  useEffect(() => {
    if (token) {
      getLogs();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Logs</title>
      </Head>
      <main id={styles.logs} className={`${!sidebarShow ? styles.full : ""}`}>
        <Table>
          <thead>
            <tr>
              <th>
                <div>index </div>
              </th>

              {headersList.map((header, idx) => {
                return (
                  <th key={`head-${idx}`}>
                    <div>{header}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataList.map((row, idxRow) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  key={idxRow}
                  onClick={() => {}}
                >
                  <td>
                    <div>{idxRow + 1} </div>
                  </td>
                  {row.map((cell, idxCell) => {
                    if (cell === true || cell === false) {
                      if (cell) {
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <div>
                              <button type="button" style={{ cursor: "unset" }}>
                                <AiOutlineCheck style={{ color: "green" }} />
                              </button>
                            </div>
                          </td>
                        );
                      }
                      return (
                        <td key={`${idxRow}-${idxCell}`}>
                          <div>
                            <button type="button" style={{ cursor: "unset" }}>
                              <AiOutlineClose style={{ color: "red" }} />
                            </button>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={`${idxRow}-${idxCell}`}
                        style={{
                          color: idxCell === 2 ? levelColor(cell) : "",
                        }}
                      >
                        <div>{cell != undefined ? cell.toString() : ""}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </main>
    </>
  );
}
