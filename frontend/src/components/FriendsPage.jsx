import React, { useEffect, useState } from "react";
import { useAuth, apiUrl } from "./context/Context";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";
import { useResolvedPath, useNavigate } from "react-router-dom";
import { FriendSuggestCard } from "./HomePage";
import SidebarNavbar from "./Sidebar";

const FriendsPage = () => {
  const { pathname } = useResolvedPath();
  const [activeTab, setActiveTab] = useState(
    pathname.includes("friend-request") ? "friendRequests" : "allFriends"
  ); // default tab
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [authUser, setAuthUser] = useAuth();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [getFSuggest, setGetFSuggest] = useState([]);

  const navigate = useNavigate();

  // get data for friends and requests
  const [allFriends, setAllFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // get all friends
  const getAllFriends = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/user/get-all-friends/${authUser?._id}?page=${page}&limit=5`
      );
      const data = await response.json();
      console.log(data);
      setAllFriends(data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "allFriends") {
      getAllFriends();
    }
  }, [page, activeTab]);

  // get friend requests
  const getFriendRequests = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/user/get-friend-requests/${authUser?._id}?page=${page}&limit=5`
      );
      const data = await response.json();
      setFriendRequests(data.friends);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "friendRequests") {
      getFriendRequests();
    }
  }, [page, activeTab]);

  // get sent requests
  const getSentRequests = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/user/get-sent-requests/${authUser?._id}?page=${page}&limit=5`
      );
      const data = await response.json();
      setSentRequests(data.friends);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "sentRequests") {
      getSentRequests();
    }
  }, [page, activeTab]);

  // handle scroll infinite
  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab]);

  // handleCancelRequest
  const handleCancelRequest = async (friendId) => {
    const res = await fetch(`${apiUrl}/user/cancel-friend-request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authUser?._id,
        friendId,
      }),
    });
    if (res.status === 200) {
      setSentRequests((prev) =>
        prev.filter((friend) => friend._id !== friendId)
      );
    }
  };

  // handleAcceptRequest
  const handleAcceptRequest = async (friendId) => {
    const res = await fetch(`${apiUrl}/user/accept-friend-request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authUser?._id,
        friendId,
      }),
    });
    if (res.status === 200) {
      setFriendRequests((prev) =>
        prev.filter((friend) => friend._id !== friendId)
      );
    }
  };

  // handleRejectRequest
  const handleRejectRequest = async (friendId) => {
    const res = await fetch(`${apiUrl}/user/reject-friend-request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authUser?._id,
        friendId,
      }),
    });
    if (res.status === 200) {
      setFriendRequests((prev) =>
        prev.filter((friend) => friend._id !== friendId)
      );
    }
  };

  // handleRemoveFriend
  const handleRemoveFriend = async (friendId) => {
    const res = await fetch(`${apiUrl}/user/remove-friend`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authUser?._id,
        friendId,
      }),
    });
    if (res.status === 200) {
      setAllFriends((prev) => prev.filter((friend) => friend._id !== friendId));
    }
  };

  // get suggest friends
  useEffect(() => {
    const getSuggestionUser = async () => {
      const res = await fetch(`${apiUrl}/random/friends-suggest`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser?._id}`,
        },
      });
      const data = await res.json();
      setGetFSuggest(data);
      // setLoadingSuggestions(false);
    };
    getSuggestionUser();

    return () => {
      setGetFSuggest([]);
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 w-full flex flex-col md:flex-row">
      <SidebarNavbar />
      <div className="dark:bg-gray-900 md:mt-0 mt-14 dark:text-white mx-auto p-4 w-full md:flex-1">
        {/* Tabs */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 mx-2 font-semibold rounded-lg ${
              activeTab === "allFriends"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("allFriends")}
          >
            All Friends
          </button>
          <button
            className={`px-4 py-2 mx-2 font-semibold rounded-lg ${
              activeTab === "friendRequests"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("friendRequests")}
          >
            Friend Requests
          </button>
          <button
            className={`px-4 py-2 mx-2 font-semibold rounded-lg ${
              activeTab === "sentRequests"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("sentRequests")}
          >
            Sent Requests
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {/* All Friends Tab */}
          {activeTab === "allFriends" && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Friends</h2>
              {allFriends.length ? (
                <ul>
                  {allFriends.map((friend, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center">
                        <img
                          onClick={() => navigate(`/profile/${friend._id}`)}
                          src={friend.profilePic}
                          alt={friend.fullName}
                          className="w-12 h-12 object-cover cursor-pointer rounded-full mr-4"
                        />
                        <span
                          onClick={() => navigate(`/profile/${friend._id}`)}
                          className="text-lg hover:underline cursor-pointer"
                        >
                          {friend.fullName}
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
                          onClick={() =>
                            activeDropdown === index
                              ? setActiveDropdown(null)
                              : setActiveDropdown(index)
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {/* Dropdown content */}
                        {activeDropdown === index && (
                          <div className="absolute right-0 mt-2 w-48 dark:bg-gray-800 bg-white border rounded-lg shadow-lg z-10">
                            <ul>
                              <li
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                  window.navigator.clipboard.writeText(
                                    location.origin + "/profile/" + friend._id
                                  );
                                  setActiveDropdown(null);
                                }}
                              >
                                <IoIosLink /> Copy Profile Link
                              </li>
                              <li
                                className="px-4 py-2 text-red-500 flex items-center gap-1 dark:hover:bg-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleRemoveFriend(friend._id)}
                              >
                                <IoPersonRemove /> Remove Friend
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No friends found.</p>
              )}
            </div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === "friendRequests" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
              {friendRequests.length ? (
                <ul className=" max-h-[150vh] overflow-y-auto">
                  {friendRequests.map((request, index) => (
                    <li key={index} className="flex items-center mb-4">
                      <img
                        onClick={() => navigate(`/profile/${request._id}`)}
                        src={request.profilePic}
                        alt={request.fullName}
                        className="w-12 h-12 object-cover cursor-pointer rounded-full mr-4"
                      />
                      <span
                        onClick={() => navigate(`/profile/${request._id}`)}
                        className="text-lg hover:underline cursor-pointer"
                      >
                        {request.fullName}
                      </span>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="ml-auto bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        Accept
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No friend requests.</p>
              )}
              {/* recomented */}
              <div className={`mt-4 ${getFSuggest?.length ? "" : "hidden"}`}>
                <h2 className="capitalize text-xl font-bold">recomented</h2>
                <div>
                  {getFSuggest?.map((suggest, index) => (
                    <FriendSuggestCard key={index} getSuggest={suggest} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sent Requests Tab */}
          {activeTab === "sentRequests" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Sent Requests</h2>
              {sentRequests.length ? (
                <ul>
                  {sentRequests.map((request, index) => (
                    <li key={index} className="flex items-center mb-4">
                      <img
                        onClick={() => navigate(`/profile/${request._id}`)}
                        src={request.profilePic}
                        alt={request.fullName}
                        className="w-12 h-12 object-cover rounded-full mr-4"
                      />
                      <span
                        onClick={() => navigate(`/profile/${request._id}`)}
                        className="text-lg hover:underline cursor-pointer"
                      >
                        {request.fullName}
                      </span>
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sent requests.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
