import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiUrl, useAuth } from "./context/Context";
import PostCard from "./PostCard"; // Assuming PostCard is a component to display posts
import { FriendSuggestCard } from "./HomePage";
import SidebarNavbar from "./Sidebar";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const [filterByPeople, setFilterByPeople] = useState(false);
  const [results, setResults] = useState([]);

  // Get search results from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${apiUrl}/random/search?q=${searchQuery}&filterByPeople=${filterByPeople}&page=1&limit=500`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUser?._id}`,
            },
          }
        );
        const data = await res.json();
        console.log("data", data);
        setResults(data || []); // Assuming API returns an array of results in 'data.results'
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    })();
  }, [filterByPeople, searchQuery, authUser]);

  const toggleFilterByPeople = () => {
    setFilterByPeople(!filterByPeople);
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen dark:text-white flex flex-col md:flex-row">
    <SidebarNavbar />
    <div className="max-w-3xl md:mt-0 mt-14 mx-auto p-4">

      {/* Filter by People Toggle */}
      <div className="mb-4 flex items-center space-x-2">
        <button
          onClick={toggleFilterByPeople}
          className={`px-4 py-2 rounded-lg text-sm ${
            filterByPeople
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {filterByPeople ? "Showing People" : "Show People Only"}
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-4 lg:min-w-[550px] lg:max-w-[550px]">
        {results.length > 0 ? (
          results.map((item,index) =>
            item.userName ? (
                <FriendSuggestCard key={index} getSuggest={item} />
            ) : (
              // Display Post (If userName doesn't exist)
              <PostCard key={item._id} post={item} />
            )
          )
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default SearchPage;
