import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex-api";
import ProfileCard from "../components/profilecard";
import type { UserType } from "../lib/types";

const PAGE_SIZE = 9;

export const Directory = () => {
  const navigate = useNavigate();
  const data = useQuery(api.users.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = data === undefined;
  const users = useMemo<UserType[]>(
    () =>
      (data ?? []).map((user) => ({
        ...user,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        experiences: user.experiences?.map((experience) => ({
          ...experience,
          id: experience._id,
        })),
      })),
    [data],
  );
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const searchFields = [
        user.firstName,
        user.lastName,
        user.email,
        user.major,
        user.graduationYear,
        user.role?.toString(),
        ...(user.experiences?.flatMap((experience) => [experience.title, experience.organization]) ?? []),
      ];

      return searchFields.some((value) => value?.toLowerCase().includes(query));
    });
  }, [searchQuery, users]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, safeCurrentPage]);
  const showingCount = paginatedUsers.length;
  const pageStart = filteredUsers.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = filteredUsers.length === 0 ? 0 : pageStart + showingCount - 1;

  return (
    <div className="min-h-full w-full bg-[#f7f2eb] text-[#10244d]">
      <section className="bg-[#300811] px-16 py-14 text-[#fff8ee]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-10">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#f0cf86]">Theta Chapter - Directory</p>
              <h1 className="mt-4 font-serif text-5xl leading-none">
                Find a <span className="text-[#f0cf86]">brother</span>.
              </h1>
              <p className="mt-4 text-xl text-[#bca29a]">Search by name, company, role, or discipline.</p>
            </div>

            <div className="flex gap-10 pt-2">
              <div className="text-center">
                <p className="text-5xl font-semibold">{users.length || 0}</p>
                <p className="mt-1 text-base text-[#bca29a]">Total members</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-semibold">60+</p>
                <p className="mt-1 text-base text-[#bca29a]">Companies</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <label className="flex h-14 items-center rounded-2xl border border-[#6b625d] bg-[#353532] px-6">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, role, organization, or discipline..."
                className="w-full bg-transparent text-lg text-[#fff8ee] outline-none placeholder:text-[#8f8d88]"
                aria-label="Search directory"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="px-16 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-lg text-[#61728f]">
              {isLoading
                ? "Loading members..."
                : filteredUsers.length === 0
                  ? "No members match your search."
                  : `Showing ${pageStart}-${pageEnd} of ${filteredUsers.length} members`}
            </p>

            {!isLoading && filteredUsers.length > 0 ? (
              <div className="flex items-center gap-3 text-sm text-[#61728f]">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
                  disabled={safeCurrentPage === 1}
                  className="rounded-xl border border-[#d5c8b5] bg-white px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-xl border border-[#d5c8b5] bg-white px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {!isLoading &&
              paginatedUsers.map((user) => (
                <ProfileCard key={String(user.id)} user={user} onClick={() => navigate(`/users/${user.id}`)} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Directory;
