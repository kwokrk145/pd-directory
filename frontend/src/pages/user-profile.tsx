import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex-api";
import type { Id } from "@convex-data";
import { getMemberMeta } from "../lib/member-meta";
import type { UserType } from "../lib/types";

export const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = useQuery(api.users.get, id ? { userId: id as Id<"users"> } : "skip");
  const isLoading = Boolean(id) && data === undefined;
  const user = useMemo<UserType | null>(
    () =>
      data
        ? {
            ...data,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            experiences: data.experiences?.map((experience) => ({
              ...experience,
              id: experience._id,
            })),
          }
        : null,
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <p className="font-serif text-xl">Loading member profile...</p>
      </div>
    );
  }

  if (!id || !user) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <div className="space-y-4 text-center">
          <p className="text-lg text-rose-700">{!id ? "Missing user id." : "User not found."}</p>
          <button
            type="button"
            onClick={() => navigate("/directory")}
            className="rounded-xl border border-[#cdbda7] bg-white px-5 py-3"
          >
            Back to directory
          </button>
        </div>
      </div>
    );
  }

  const { major, graduationYear, accentClass, initials } = getMemberMeta(user);

  return (
    <div className="min-h-full w-full bg-[#f7f2eb] text-[#10244d]">
      <section className="bg-[#300811] px-16 py-14 text-[#fff8ee]">
        <div className="mx-auto flex max-w-7xl items-center gap-8">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-medium ${accentClass}`}>
            {initials}
          </div>

          <div>
            <h1 className="font-serif text-4xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-2 text-lg text-[#c1a89f]">{user.email}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {major ? <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">{major}</span> : null}
              {graduationYear ? (
                <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">
                  Class of {graduationYear}
                </span>
              ) : null}
              <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">
                Theta Chapter
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-16 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Experiences</h2>

          <div className="mt-10 space-y-6">
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((experience) => (
                <div key={experience.id} className="rounded-[28px] border border-[#e5dac8] bg-white p-8">
                  <h3 className="text-2xl font-semibold">{experience.title}</h3>
                  <p className="mt-2 text-lg text-[#5f7191]">{experience.organization}</p>
                  <p className="mt-3 text-base text-[#97a2b7]">
                    {experience.startDate} - {experience.endDate}
                  </p>
                  {experience.description ? (
                    <p className="mt-5 max-w-5xl text-base leading-8 text-[#5f7191]">{experience.description}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-[#e5dac8] bg-white p-8 text-[#61728f]">No experiences added yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
