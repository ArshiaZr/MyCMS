import Head from "next/head";
import styles from "../../styles/AdminsManagement.module.scss";
import Form from "@/components/Form";
import TextInput from "@/components/TextInput";
import PasswordInput from "@/components/PasswordInput";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { useAppStatesContext } from "@/contexts/States";
import axios from "axios";
import Select from "@/components/Select";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function AdminsManagement() {
  const [newAdminInputs, setNewAdminInputs] = useState({});
  const [newAdminErrors, setNewAdminErrors] = useState({});

  const onNewAdminChange = (e) => {
    setNewAdminInputs({ ...newAdminInputs, [e.target.name]: e.target.value });
  };

  const [adminsHeader, setAdminsHeader] = useState([
    "username",
    "dateCreated",
    "role",
    "enabled",
    "verified",
  ]);
  const [adminsData, setAdminsData] = useState([]);

  const [admins, setAdmins] = useState([]);

  const [roles, setRoles] = useState([]);

  const { token, sidebarShow, addAlert, admin, getAdmin } =
    useAppStatesContext();

  const changeRole = (id, e) => {
    if (e.target.value) {
      axios
        .post(
          `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/change-role/${id}`,
          { role: e.target.value },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            getAdmins();
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
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/enabled/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getAdmins();
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
  };

  const toggleVerified = (id) => {
    axios
      .patch(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/verified/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getAdmins();
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
  };

  const toggleAdmin = (cellIdx, adminsIdx, e = null) => {
    if (adminsHeader[cellIdx] === "enabled") {
      toggleEnabled(admins[adminsIdx]._id);
    } else if (adminsHeader[cellIdx] === "verified") {
      toggleVerified(admins[adminsIdx]._id);
    } else if (adminsHeader[cellIdx] === "role") {
      changeRole(admins[adminsIdx]._id, e);
    }
  };

  const deleteAdmin = (adminsIdx) => {
    const id = admins[adminsIdx]._id;
    axios
      .delete(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.success) {
          getAdmins();
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

  const getAdmins = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.admins) {
          setAdmins(res.data.admins);
          let emp = res.data.admins;
          let ret = [];
          for (let i = 0; i < emp.length; i++) {
            let tmp = [];
            for (let j = 0; j < adminsHeader.length; j++) {
              tmp.push(emp[i][adminsHeader[j]]);
            }
            ret.push(tmp);
          }
          setAdminsData(ret);
        }
        if (res.data.roles) {
          setRoles(res.data.roles.map((role) => role.title));
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

  const createAdmin = (e) => {
    e.preventDefault();
    setNewAdminErrors({});

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/register`,
        newAdminInputs,
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
          getAdmins();
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.errors) {
          setNewAdminErrors(response.data.errors);
        }
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
      getAdmins();
      getAdmin();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Admins Management</title>
      </Head>

      <main
        id={styles.adminsManagement}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.addNewWrapper}>
          <h2 className={styles.title}>Add new admin:</h2>
          <Form alignment="horizontal" onSubmit={createAdmin}>
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="username"
              onChange={onNewAdminChange}
              name="username"
              error={newAdminErrors.username}
            />
            <PasswordInput
              openedIcon="/icons/EyeIcon.svg"
              lockedIcon="/icons/LockIcon.svg"
              placeholder="password"
              onChange={onNewAdminChange}
              name="password"
              error={newAdminErrors.password}
            />
            <Select
              options={roles ? roles : admin.employees}
              title="role"
              showingTitle="Roles:"
              onChange={onNewAdminChange}
              error={newAdminErrors.role}
            />
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
        </div>

        <div className={styles.adminsTableWrapper}>
          <h2 className={styles.title}>List of admins:</h2>
          <Table>
            <thead>
              <tr>
                <th>
                  <div>index</div>
                </th>

                {adminsHeader.map((header, idx) => {
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
              {adminsData.map((row, idxRow) => {
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
                                  onClick={() => toggleAdmin(idxCell, idxRow)}
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
                                onClick={() => toggleAdmin(idxCell, idxRow)}
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
                                options={roles ? roles : admin.employees}
                                title=""
                                showingTitle=""
                                onChange={(e) =>
                                  toggleAdmin(idxCell, idxRow, e)
                                }
                                defaultValue={cell}
                                titleShow={false}
                                error={newAdminErrors.role}
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
                          onClick={() => deleteAdmin(idxRow)}
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
