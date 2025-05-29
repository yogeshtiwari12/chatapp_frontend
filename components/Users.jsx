import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import User from "./User";
import { getUnreadCounts } from "./redux/messgaeslice";
import { url } from "../url";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-600 border-t-transparent"></div>
          <p className="text-sky-600 text-sm">Loading contacts...</p>
        </div>
      </div>
    );
  }

  const userList = Array.isArray(users) ? users : [];

  if (userList.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white p-8">
        <div className="text-4xl mb-3">👤</div>
        <h2 className="text-xl font-semibold text-sky-900 mb-2">No Contacts Found</h2>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Your contact list is empty. New contacts will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
   
      
      <div className="divide-y divide-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {userList.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Users;