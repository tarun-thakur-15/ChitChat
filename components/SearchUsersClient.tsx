"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Users, Calendar, UserPlus, MessageCircle } from "lucide-react";
import { SuggestedUser, SearchUser } from "@/app/services/schema";
import { searchUsersApi } from "@/app/services/api";
import Link from "next/link";
import { startProgress } from "@/app/utils/progress";
interface Props {
  initialUsers: SuggestedUser[];
  token: string | undefined;
}

export default function SearchUsersClient({ initialUsers, token }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState(initialUsers);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [searchQuery, users]);

  //   -------------functionalities for searchbar-------------------
  const [suggestedUsers] = useState(initialUsers);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  // Debounce hook
  function useDebounce(value: string, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        if (token) {
          const data = await searchUsersApi(debouncedQuery, token);
          setSearchResults(data.results);
        }
      } catch (err) {
        console.error("Search API error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, token]);

  const displayedUsers = useMemo(() => {
    if (searchQuery.trim()) return searchResults;
    return suggestedUsers;
  }, [searchQuery, suggestedUsers, searchResults]);

  const heading = searchQuery.trim()
    ? `Search Results (${displayedUsers.length})`
    : "Suggested for You";

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Users
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Find and connect with team members
              </p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-4 py-6">
          <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {heading}
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <>
              <div className="max-w-4xl mx-auto mb-6">
                <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </>
          ) : displayedUsers.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {displayedUsers.map((user) => (
                <Link href={`/user/${user.username}`} onClick={()=> startProgress()} key={user._id}>
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={user.profileImage}
                            alt={user.fullName}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {user.joinedOn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{user.friendsCount} friends</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
//checkpoint
