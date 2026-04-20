import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex-api";
import ProfileCard from "../components/profilecard";
import type { UserType } from "../lib/types";

export const Directory = () => {
  const navigate = useNavigate();
  const data = useQuery(api.users.list);
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
            <div className="flex h-14 items-center rounded-2xl border border-[#6b625d] bg-[#353532] px-6 text-lg text-[#8f8d88]">
              Search by name, role, or organization...
            </div>
          </div>
        </div>
      </section>

      <section className="px-16 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-lg text-[#61728f]">{isLoading ? "Loading members..." : `Showing ${users.length} members`}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {!isLoading &&
              users.map((user) => (
                <ProfileCard key={String(user.id)} user={user} onClick={() => navigate(`/users/${user.id}`)} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Directory;
