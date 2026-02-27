import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import User from "./User";
import { getUnreadCounts } from "./redux/messgaeslice";
import { url } from "../url";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${url}/userroute12/users`, {
          withCredentials: true,
        });

        if (Array.isArray(res.data)) {
          setUsers(res.data);
          console.log("Fetched users:", res.data);
        } else if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
          console.log("Fetched users:", res.data.users);
        } else {
          console.error("API did not return an array:", res.data);
          setUsers([]);
        }

        dispatch(getUnreadCounts());
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const userList = (Array.isArray(users) ? users : []).filter(
    (u) => u._id !== currentUser?.id && u._id !== currentUser?._id
  );

  if (loading) {
    return (
      <div className="px-3 py-2 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded-full w-3/5" />
              <div className="h-2.5 bg-gray-100 rounded-full w-2/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (userList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">No contacts yet</p>
        <p className="text-xs text-gray-400 mt-1 text-center">Contacts will appear here once available</p>
      </div>
    );
  }

  return (
    <div className="px-2 py-1.5 space-y-0.5">
      {userList.map((user) => (
        <User key={user._id} user={user} />
      ))}
    </div>
  );
}

export default Users;