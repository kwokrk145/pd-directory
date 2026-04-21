import { useMemo, useState, type ChangeEvent, type ComponentProps } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@convex-api";
import type { Id } from "@convex-data";
import useAuth from "../hooks/use-auth";

type MemberForm = {
  firstName: string;
  lastName: string;
  role: string;
};

const emptyMemberForm: MemberForm = {
  firstName: "",
  lastName: "",
  role: "",
};

export const MemberAdmin = () => {
  const { isLoading } = useAuth();
  const verifyAccess = useMutation(api.members.verifyAccess);
  const addApproved = useMutation(api.members.addApproved);
  const removeApproved = useMutation(api.members.removeApproved);
  const [password, setPassword] = useState("");
  const [unlockedPassword, setUnlockedPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [form, setForm] = useState<MemberForm>(emptyMemberForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<Id<"members"> | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<{
    id: Id<"members">;
    firstName: string;
    lastName: string;
    role: number;
  } | null>(null);
  const members = useQuery(api.members.listApproved, unlockedPassword ? { password: unlockedPassword } : "skip");

  const sortedMembers = useMemo(
    () => [...(members ?? [])].sort((a, b) => a.role - b.role),
    [members],
  );

  const handleFormChange =
    (field: keyof MemberForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleUnlock: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    if (!password.trim()) {
      toast.error("Enter the active member password.");
      return;
    }

    setIsUnlocking(true);

    try {
      await verifyAccess({ password });
      setUnlockedPassword(password);
      toast.success("Active member tools unlocked.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const role = Number(form.role.trim());

    if (!firstName || !lastName || !form.role.trim()) {
      toast.error("Enter first name, last name, and role number.");
      return;
    }

    if (!Number.isInteger(role)) {
      toast.error("Role number must be a whole number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addApproved({
        password: unlockedPassword,
        firstName,
        lastName,
        role,
      });
      setForm(emptyMemberForm);
      toast.success("Member added to the active member directory.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) {
      return;
    }

    setDeletingMemberId(memberToDelete.id);

    try {
      await removeApproved({
        password: unlockedPassword,
        memberId: memberToDelete.id,
      });
      setMemberToDelete(null);
      toast.success("Member removed from the active member directory.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setDeletingMemberId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <p className="font-serif text-xl">Loading member tools...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#f7f2eb] text-[#10244d]">
      <section className="bg-[#300811] px-12 py-12 text-[#fff8ee]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.18em] text-[#f0cf86]">Active Member Directory</p>
          <h1 className="mt-3 font-serif text-4xl">Member access list</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d0b4a4]">
            Add approved members before they create an account.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-12 py-12">
        {!unlockedPassword ? (
          <div className="mx-auto max-w-md rounded-[28px] border border-[#e5dac8] bg-white p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Password Required</p>
            <h2 className="mt-3 font-serif text-2xl">Unlock member tools</h2>
            <p className="mt-3 text-sm leading-7 text-[#5f7191]">
              You must be signed in and enter the active member password.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleUnlock}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUnlocking}
                className="h-12 w-full rounded-2xl bg-[#300811] text-sm font-medium text-[#fff8ee] transition hover:bg-[#571120] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUnlocking ? "Unlocking..." : "Unlock"}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-[#e5dac8] bg-white p-8">
              <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Add Member</p>
              <h2 className="mt-3 font-serif text-2xl">Approved member</h2>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">First name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleFormChange("firstName")}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Last name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleFormChange("lastName")}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Role number</label>
                  <input
                    type="number"
                    value={form.role}
                    onChange={handleFormChange("role")}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#300811] text-sm font-medium text-[#fff8ee] transition hover:bg-[#571120] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Adding..." : "Add active member"}
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-[#e5dac8] bg-white p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Approved Members</p>
                  <h2 className="mt-3 font-serif text-2xl">Current access list</h2>
                </div>
                <span className="rounded-xl bg-[#f8f3e7] px-4 py-2 text-sm text-[#8f6710]">
                  {sortedMembers.length} members
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {members === undefined ? (
                  <p className="text-sm text-[#61728f]">Loading members...</p>
                ) : sortedMembers.length > 0 ? (
                  sortedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#e8dfd1] bg-[#fffdf9] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="mt-1 text-sm text-[#61728f]">Role {member.role}</p>
                      </div>
                      <button
                        type="button"
                        disabled={deletingMemberId === member._id}
                        onClick={() =>
                          setMemberToDelete({
                            id: member._id,
                            firstName: member.firstName,
                            lastName: member.lastName,
                            role: member.role,
                          })
                        }
                        className="rounded-xl border border-[#ead6d1] px-4 py-2 text-sm text-[#9b4b43] transition hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingMemberId === member._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#61728f]">No approved members added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {memberToDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-member-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && deletingMemberId === null) {
              setMemberToDelete(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-[24px] border border-[#ead6d1] bg-white p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#9b4b43]">Delete Member</p>
            <h2 id="delete-member-title" className="mt-3 font-serif text-2xl text-[#10244d]">
              Are you sure?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5f7191]">
              Remove {memberToDelete.firstName} {memberToDelete.lastName} with role number {memberToDelete.role} from
              the active member access list.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deletingMemberId !== null}
                onClick={() => setMemberToDelete(null)}
                className="h-12 flex-1 rounded-2xl border border-[#ddd4c6] text-sm font-medium text-[#5f7191] transition hover:bg-[#fbfaf7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingMemberId !== null}
                onClick={handleDelete}
                className="h-12 flex-1 rounded-2xl bg-[#9b4b43] text-sm font-medium text-white transition hover:bg-[#843d36] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingMemberId !== null ? "Deleting..." : "Delete member"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MemberAdmin;
