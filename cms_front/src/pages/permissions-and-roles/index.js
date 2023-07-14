import Head from "next/head";
import styles from "../../styles/PermissionsAndRoles.module.scss";
import { useAppStatesContext } from "@/contexts/States";
import Form from "@/components/Form";
import TextInput from "@/components/TextInput";
import { useEffect, useState, useRef } from "react";
import Select from "@/components/Select";
import Button from "@/components/Button";
import EditableTextInput from "@/components/EditableTextInput";
import EditableMultiItem from "@/components/EditableMultiItem";
import Table from "@/components/Table";
import axios from "axios";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

export default function PermissionsAndRoles() {
  const { sidebarShow, getAdmin } = useAppStatesContext();

  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleErrors, setNewRoleErrors] = useState({});

  const previousChangingRef = useRef(null);

  const [rolesHeader, setRolesHeader] = useState([
    "title",
    "dateCreated",
    "permissions",
    "employees",
  ]);
  const [rolesData, setRolesData] = useState([]);

  const [roles, setRoles] = useState([]);

  const [permissionElements, setPermissionElements] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [employeeElements, setEmployeeElements] = useState([]);
  const [employees, setEmployees] = useState([]);

  const { admin, token, addAlert } = useAppStatesContext();

  const [editingInput, setEditingInput] = useState({});

  const onNewRoleChange = (e) => {
    setNewRoleTitle(e.target.value);
  };

  const createRole = (e) => {
    e.preventDefault();
    setNewRoleErrors({});

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/roles/add`,
        { title: newRoleTitle, permissions: permissions, employees: employees },
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
          setNewRoleTitle("");
          getRoles();
          getAdmin();
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.errors) {
          setNewRoleErrors(response.data.errors);
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

  const deleteRole = (idxRow) => {
    const id = roles[idxRow]._id;

    axios
      .delete(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/roles/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.msg) {
          addAlert({
            message: res.data.msg,
            type: "success",
            time: 3000,
          });
          getRoles();
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

  const getRoles = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/roles`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.roles) {
          let ret = [];
          let rolesTmp = res.data.roles;
          setRoles(rolesTmp);
          for (let i = 0; i < rolesTmp.length; i++) {
            let tmp = [];
            for (let j = 0; j < rolesHeader.length; j++) {
              tmp.push(rolesTmp[i][rolesHeader[j]]);
            }
            ret.push(tmp);
          }
          setRolesData(ret);
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.errors) {
          setNewRoleErrors(response.data.errors);
        }
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

  const onChangePermissions = (index, e) => {
    let tmp = permissions;
    tmp[index] = e.target.value;
    setPermissions(tmp);
  };

  const onPerPlusClick = (index) => {
    setPermissions(permissions.concat(""));
    setPermissionElements(
      permissionElements.concat(
        <Select
          key={permissionElements.length}
          options={admin.permissions ? admin.permissions : []}
          title={`permission_${permissionElements.length}`}
          showingTitle={`${permissionElements.length + 1}:`}
          onChange={(e) => onChangePermissions(permissionElements.length, e)}
        />
      )
    );
  };

  const onPerMinusClick = (e) => {
    let tmp = [...permissionElements];
    tmp.pop();
    setPermissionElements(tmp);
    let tmp1 = [...permissions];
    tmp1.pop();
    setPermissions(tmp1);
  };

  const onChangeEmployees = (index, e) => {
    let tmp = employees;
    tmp[index] = e.target.value;
    setEmployees(tmp);
  };

  const onEmpPlusClick = (index) => {
    setEmployees(employees.concat(""));
    setEmployeeElements(
      employeeElements.concat(
        <Select
          key={employeeElements.length}
          options={admin.employees ? admin.employees : []}
          title={`employee_${employeeElements.length}`}
          showingTitle={`${employeeElements.length + 1}:`}
          onChange={(e) => onChangeEmployees(employeeElements.length, e)}
        />
      )
    );
  };

  const onEmpMinusClick = (e) => {
    let tmp = [...employeeElements];
    tmp.pop();
    setEmployeeElements(tmp);
    let tmp1 = [...employees];
    tmp1.pop();
    setEmployees(tmp1);
  };

  const onChangingEditRole = (e, idxRow, idxCell) => {
    let tmp = { ...editingInput };
    if (tmp.idx !== idxRow) {
      if (
        previousChangingRef.current !== null &&
        previousChangingRef.current.target.value &&
        tmp.idx
      ) {
        previousChangingRef.current.target.value = rolesData[tmp.idx][idxCell];
      }
      previousChangingRef.current = e;
      tmp = { idx: idxRow };
    }
    setEditingInput({ ...tmp, [e.target.name]: e.target.value });
  };

  const onEditRole = () => {
    let id = roles[editingInput.idx]._id;

    if (editingInput.idx == undefined || editingInput.idx == null) {
      return;
    }

    axios
      .post(
        `${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/roles/edit/${id}`,
        { ...editingInput },
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
          setEditingInput({});
          getRoles();
          getAdmin();
        }
      })
      .catch(({ response }) => {
        if (response.data && response.data.errors) {
          setNewRoleErrors(response.data.errors);
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

  const addPermission = (idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.permissions) {
      tmp.permissions = rolesData[idxRow][2];
    }

    tmp.permissions.push("");
    setEditingInput(tmp);
  };

  const changePermission = (index, value, items, idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.permissions) {
      tmp.permissions = items;
    }

    tmp.permissions[index] = value;
    setEditingInput(tmp);
  };

  const deletePermission = (index, items, idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.permissions) {
      tmp.permissions = items;
    }

    tmp.permissions.splice(index, 1);
    setEditingInput(tmp);
  };

  const addEmployees = (idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.employees) {
      tmp.employees = rolesData[idxRow][3];
    }

    tmp.employees.push("");
    setEditingInput(tmp);
  };

  const changeEmployee = (index, value, items, idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.employees) {
      tmp.employees = items;
    }

    tmp.employees[index] = value;
    setEditingInput(tmp);
  };

  const deleteEmployee = (index, items, idxRow) => {
    let tmp = { ...editingInput };

    if (tmp.idx !== idxRow) {
      tmp = {};
      tmp.idx = idxRow;
    }

    if (!tmp.employees) {
      tmp.employees = items;
    }

    tmp.employees.splice(index, 1);
    setEditingInput(tmp);
  };

  useEffect(() => {
    if (token) {
      getRoles();
      getAdmin();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Permissions and roles</title>
      </Head>
      <main
        id={styles.permissionsAndRoles}
        className={`${!sidebarShow ? styles.full : ""}`}
      >
        <div className={styles.addNewWrapper}>
          <h2 className={styles.title}>Add new Role:</h2>
          <Form alignment="horizontal" onSubmit={createRole}>
            <TextInput
              icon="/icons/PersonIcon.svg"
              placeholder="Title"
              onChange={onNewRoleChange}
              name="title"
              error={newRoleErrors.title}
            />
            <div className={styles.rolesWrapper}>
              <p className={styles.title}>permissions:</p>
              <div className={styles.permissionsToAdd}>
                {permissionElements}
              </div>
              <div className={styles.actions}>
                <div className={styles.plus} onClick={onPerPlusClick}>
                  <AiOutlinePlusCircle />
                </div>
                {permissionElements.length > 0 ? (
                  <div className={styles.minus} onClick={onPerMinusClick}>
                    <AiOutlineMinusCircle />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className={styles.employeesWrapper}>
              <p className={styles.title}>employees:</p>
              <div className={styles.employeesToAdd}>{employeeElements}</div>
              <div className={styles.actions}>
                <div className={styles.plus} onClick={onEmpPlusClick}>
                  <AiOutlinePlusCircle />
                </div>
                {employeeElements.length > 0 ? (
                  <div className={styles.minus} onClick={onEmpMinusClick}>
                    <AiOutlineMinusCircle />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

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
          <h2 className={styles.title}>List of roles:</h2>
          <Table>
            <thead>
              <tr>
                <th>
                  <div>index</div>
                </th>

                {rolesHeader.map((header, idx) => {
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
              {rolesData.map((row, idxRow) => {
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
                              name={rolesHeader[idxCell]}
                              originalValue={cell}
                              onChange={(e) =>
                                onChangingEditRole(e, idxRow, idxCell)
                              }
                            />
                          </td>
                        );
                      }
                      if (idxCell == 2) {
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <EditableMultiItem
                              options={
                                admin.permissions ? admin.permissions : []
                              }
                              originalItems={cell}
                              name="permissions"
                              addItem={() => addPermission(idxRow)}
                              changingItems={editingInput.permissions}
                              idxRow={idxRow}
                              onChange={changePermission}
                              deleteItem={deletePermission}
                            />
                          </td>
                        );
                      }
                      if (idxCell == 3) {
                        return (
                          <td key={`${idxRow}-${idxCell}`}>
                            <EditableMultiItem
                              options={
                                admin.employees
                                  ? admin.employees.filter(
                                      (employee) => employee != row[0]
                                    )
                                  : []
                              }
                              originalItems={cell}
                              name="employees"
                              addItem={() => addEmployees(idxRow)}
                              changingItems={editingInput.employees}
                              idxRow={idxRow}
                              onChange={changeEmployee}
                              deleteItem={deleteEmployee}
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
                          onClick={() => onEditRole()}
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
                          onClick={() => deleteRole(idxRow)}
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
