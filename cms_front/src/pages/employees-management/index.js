import Head from "next/head";
import styles from "../../styles/EmployeesManagement.module.scss";
import { useState, useEffect } from "react";
import Table from "@/components/Table";
import { useAppStatesContext } from "@/contexts/States";
import axios from "axios";

import getConfig from "next/config";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import Sortby from "@/components/SortBy";
import {
  camelToNormal,
  dateForm,
  mongoDateToString,
  snakeToNormal,
} from "@/utils/parse";
import EditUser from "@/components/popups/EditUser";
import AddUser from "@/components/popups/AddUser";
import { tempEmployees } from "../../../constants";
const { publicRuntimeConfig } = getConfig();

export default function EmployeesManagement() {
  const [employeesHeader, setEmployeesHeader] = useState([
    "username",
    "role",
    "dateCreated",
    "action",
    "email",
    "_id",
  ]);

  const displayHeaderIndex = 4;

  const [sortSelected, SetSortSelected] = useState("");
  const [employeesDataStored, setEmployeesDataStored] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);

  const [currentEmployee, setCurrentEmployee] = useState(null);

  const [employees, setEmployees] = useState([]);

  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const [editToggle, setEditToggle] = useState(false);

  const [addToggle, setAddToggle] = useState(false);

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

  // const toggleEmployee = (cellIdx, employeesIdx, e = null) => {
  //   if (employeesHeader[cellIdx] === "enabled") {
  //     toggleEnabled(employees[employeesIdx]._id);
  //   } else if (employeesHeader[cellIdx] === "verified") {
  //     toggleVerified(employees[employeesIdx]._id);
  //   } else if (employeesHeader[cellIdx] === "role") {
  //     changeRole(employees[employeesIdx]._id, e);
  //   }
  // };

  const deleteEmployee = (employeesID) => {
    axios
      .delete(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/employees/${employeesID}`,
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

  useEffect(() => {
    //Temp
    setEmployees(tempEmployees);

    let emp = tempEmployees;
    let ret = [];
    for (let i = 0; i < emp.length; i++) {
      let tmp = [];
      for (let j = 0; j < employeesHeader.length; j++) {
        tmp.push(emp[i][employeesHeader[j]]);
      }
      ret.push(tmp);
    }
    setEmployeesDataStored(ret);
    setEmployeesData(ret);
  }, [tempEmployees]);

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
          setEmployeesDataStored(ret);
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

  const onSearchChanged = (e) => {
    let value = e.target.value.toLowerCase();
    let tmp = employeesDataStored.filter((row) => {
      return row.join("").toLowerCase().includes(value);
    });
    setEmployeesData(tmp);
  };

  useEffect(() => {
    const sortIndex = employeesHeader.indexOf(sortSelected);
    if (sortIndex !== -1) {
      let tmp = [...employeesDataStored].sort((row1, row2) => {
        return row1[sortIndex].localeCompare(row2[sortIndex]);
      });
      setEmployeesDataStored(tmp);
      setEmployeesData(tmp);
    }
  }, [sortSelected, employeesHeader]);

  const openAddEmployee = () => {
    setAddToggle(true);
  };

  return (
    <>
      <Head>
        <title>Employees Management</title>
      </Head>

      <main
        id={styles.employeesManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <EditUser
          toggle={editToggle}
          setToggle={setEditToggle}
          employee={currentEmployee}
        />
        <AddUser toggle={addToggle} setToggle={setAddToggle} />
        <div className={styles.employeesTableWrapper}>
          <h2 className={styles.title}>Employee Management</h2>
          <div className={styles.searchAndOrderContainer}>
            <TextInput
              icon="/icons/searchIconDark.svg"
              placeholder="search"
              name="search"
              direction="reverse"
              maxWidth="60%"
              background="#fff"
              color="rgba(26, 29, 31, 0.50)"
              borderRadius="17px"
              onChange={onSearchChanged}
            />
            <Button
              text="add user"
              type="submit"
              color="#f2f2f2"
              hoverColor="#f2f2f2"
              backgroundColor="#93a7ff"
              hoverBackgroundColor="#0045bb"
              icon="/icons/plusIconLight.svg"
              minWidth="fit-content"
              width="fit-content"
              borderRadius="17px"
              onClick={openAddEmployee}
            />
            <Sortby
              sortSelected={sortSelected}
              SetSortSelected={SetSortSelected}
              options={["", "username", "role", "dateCreated"]}
            />
          </div>
          <Table>
            <caption>list users</caption>
            <thead>
              <tr>
                {employeesHeader
                  .slice(0, displayHeaderIndex)
                  .map((header, idx) => {
                    return (
                      <th key={`head-${idx}`}>
                        <div>{camelToNormal(header)}</div>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {employeesData.map((row, idxRow) => {
                return (
                  <tr key={idxRow}>
                    <td>
                      <div className={styles.usernameWrapper}>
                        <div className={styles.username}>{row[0]}</div>

                        <div className={styles.email}>{row[4]}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.role}>{snakeToNormal(row[1])}</div>
                    </td>
                    <td>
                      <div className={styles.datecreated}>
                        {dateForm(mongoDateToString(row[2]))}
                      </div>
                    </td>
                    <td>
                      <div className={styles.action}>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentEmployee(
                              employees.find((employee) => {
                                return employee["_id"] == row[5];
                              })
                            );

                            setEditToggle(true);
                          }}
                        >
                          <img src="/icons/edit1IconGray.svg" alt="edit" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteEmployee(row[5]);
                          }}
                        >
                          <img src="/icons/delete1IconGray.svg" alt="delete" />
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
