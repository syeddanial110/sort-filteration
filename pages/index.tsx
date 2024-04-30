import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
};

type PageProps = {
  users: User[];
};

type SearchTerms = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default ({ users }: PageProps) => {
  const [userList, setUserList] = useState<User[]>(users ?? []);
  const [filterTerms, setFilterTerms] = useState<SearchTerms>({});

  // This function removes a user with a specific ID from the user list and updates the state.
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<string>("");

  // Function to remove a user with a specific ID from the user list and update the state.
  const handleRemoveUser = (id: number) => {
    const filteredUserList = userList.filter((user) => user.id !== id);
    setUserList(filteredUserList);
  };

  // Function to sort the user list based on a specific field and order
  const handleSort = (field: string) => {
    const sortedList = [...userList].sort((a, b) => {
      const valueA = a[field].toLowerCase();
      const valueB = b[field].toLowerCase();
      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    setUserList(sortedList);
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  // This function filters the user list based on filter terms (firstName, lastName, email) and updates the state.

  return (
    <div>
      <table className={styles.UserTable}>
        <thead>
          <tr>
            <th></th>
            <th onClick={() => handleSort("first_name")}>
              First Name{" "}
              {sortField === "first_name" && sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th onClick={() => handleSort("last_name")}>
              Last Name{" "}
              {sortField === "last_name" && sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th onClick={() => handleSort("email")}>
              email {sortField === "email" && sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className={styles.Avatar}
                  />
                </td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td
                  onClick={() => handleRemoveUser(user.id)}
                  className={styles.Remove}
                >
                  X
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {userList.length === 0 && <div>No users</div>}
    </div>
  );
};

// This function is used to fetch a list of users from an external API (https://reqres.in/api/users?page=1)
// and provide them as props to a Next.js page component. It is intended for server-side rendering.
export const getServerSideProps = async () => {
  try {
    const response = await fetch("https://reqres.in/api/users?page=2");
    const usersResponse = await response.json();
    const users = usersResponse.data;
    return { props: { users } };
  } catch (error) {
    console.error(error);
  }
};
