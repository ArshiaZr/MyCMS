import Head from "next/head";
import styles from "../../styles/EmployeesManagement.module.scss";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useAppStatesContext } from "@/contexts/States";
import axios from "axios";
import Select from "@/components/Select";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function EmployeesManagement() {
  const [employeesHeader, setEmployeesHeader] = useState([
    "username",
    "dateCreated",
    "role",
    "enabled",
    "verified",
  ]);
  const [employeesData, setEmployeesData] = useState([]);

  const [employees, setEmployees] = useState([]);

  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const changeRole = (id, e) => {
    if (e.target.value) {
      axios
        .post(
          `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees/change-role/${id}`,
          { role: e.target.value },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            getEmployees();
            addAlert({
              message: "The admin has been updated.",
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
          } else {
            addAlert({
              message: "Something went wrong.",
              type: "error",
              time: 3000,
            });
          }
        });
    }
  };

  const toggleEnabled = (id) => {
    axios
      .patch(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees/enabled/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getEmployees();
          addAlert({
            message: "The employee has been updated.",
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
        } else {
          addAlert({
            message: "Something went wrong.",
            type: "error",
            time: 3000,
          });
        }
      });
  };

  const toggleVerified = (id) => {
    axios
      .patch(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees/verified/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getEmployees();
          addAlert({
            message: "The employee has been updated.",
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
        } else {
          addAlert({
            message: "Something went wrong.",
            type: "error",
            time: 3000,
          });
        }
      });
  };

  const toggleEmployee = (cellIdx, employeesIdx, e = null) => {
    if (employeesHeader[cellIdx] === "enabled") {
      toggleEnabled(employees[employeesIdx]._id);
    } else if (employeesHeader[cellIdx] === "verified") {
      toggleVerified(employees[employeesIdx]._id);
    } else if (employeesHeader[cellIdx] === "role") {
      changeRole(employees[employeesIdx]._id, e);
    }
  };

  const deleteEmployee = (employeesIdx) => {
    const id = employees[employeesIdx]._id;
    axios
      .delete(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          getEmployees();
          addAlert({
            message: "The admin has been deleted.",
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
        } else {
          addAlert({
            message: "Something went wrong.",
            type: "error",
            time: 3000,
          });
        }
      });
  };

  const getEmployees = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.employees) {
          setEmployees(res.data.employees);
          let emp = res.data.employees;
          let ret = [];
          for (let i = 0; i < emp.length; i++) {
            let tmp = [];
            for (let j = 0; j < employeesHeader.length; j++) {
              tmp.push(emp[i][employeesHeader[j]]);
            }
            ret.push(tmp);
          }
          setEmployeesData(ret);
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
            message: "Something went wrong.",
            type: "error",
            time: 3000,
          });
        }
      });
  };

  useEffect(() => {
    if (token) {
      getEmployees();
      getAdmin();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Employees Management</title>
      </Head>

      <main
        id={styles.employeesManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.employeesTableWrapper}>
          <h2 className={styles.title}>List of employees:</h2>
          <Table>
            <thead>
              <tr>
                <th>
                  <div>index</div>
                </th>

                {employeesHeader.map((header, idx) => {
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
              {employeesData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <div>{idxRow + 1} </div>
                    </td>
                    {row.map((cell, idxCell) => {
                      if (cell === true || cell === false) {
                        if (cell) {
                          return (
                            <td key={`${idxRow}-${idxCell}`}>
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleEmployee(idxCell, idxRow)
                                  }
                                >
                                  <AiOutlineCheck style={{ color: "green" }} />
                                </button>
                              </div>
                            </td>
                          );
                        }
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleEmployee(idxCell, idxRow)}
                              >
                                <AiOutlineClose style={{ color: "red" }} />
                              </button>
                            </div>
                          </td>
                        );
                      }
                      if (idxCell === 2) {
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <div>
                              <Select
                                options={admin.employees}
                                title=""
                                showingTitle=""
                                onChange={(e) =>
                                  toggleEmployee(idxCell, idxRow, e)
                                }
                                defaultValue={cell}
                                titleShow={false}
                              />
                            </div>
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
                      <div>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => deleteEmployee(idxRow)}
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
