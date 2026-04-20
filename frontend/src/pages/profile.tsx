import { useEffect, useMemo, useState, type ChangeEvent, type ComponentProps } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@convex-api";
import type { Id } from "@convex-data";
import useAuth from "../hooks/use-auth";
import { getMemberMeta } from "../lib/member-meta";
import type { Experience } from "../lib/types";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 36 }, (_, index) => String(new Date().getFullYear() + 5 - index));

type ExperienceForm = {
  title: string;
  organization: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorking: boolean;
  description: string;
};

type ProfileTab = "experiences" | "settings";

const emptyForm: ExperienceForm = {
  title: "",
  organization: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  currentlyWorking: false,
  description: "",
};

const parseDate = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "Present") {
    return { month: "", year: "", currentlyWorking: true };
  }

  const [month = "", year = ""] = trimmed.split(" ");
  return { month, year, currentlyWorking: false };
};

const getFormFromExperience = (experience: Experience): ExperienceForm => {
  const start = parseDate(experience.startDate);
  const end = parseDate(experience.endDate);

  return {
    title: experience.title,
    organization: experience.organization,
    startMonth: start.month,
    startYear: start.year,
    endMonth: end.month,
    endYear: end.year,
    currentlyWorking: end.currentlyWorking,
    description: experience.description ?? "",
  };
};

const validateDates = (
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  currentlyWorking: boolean
) => {
  if (!startYear || !startMonth) {
    toast.error("Please fill in all the dates!");
    return false;
  }

  if (!currentlyWorking && (!endYear || !endMonth)) {
    toast.error("Please fill in all the dates!");
    return false;
  }

  if (currentlyWorking) {
    return true;
  }

  const startYearNum = Number(startYear);
  const endYearNum = Number(endYear);

  if (startYearNum > endYearNum) {
    toast.error("Start year cannot be later than end year!");
    return false;
  }

  if (startYearNum === endYearNum) {
    const startMonthIndex = months.indexOf(startMonth);
    const endMonthIndex = months.indexOf(endMonth);

    if (startMonthIndex > endMonthIndex) {
      toast.error("Start month cannot be later than end month in the same year!");
      return false;
    }
  }

  return true;
};

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const createExperience = useMutation(api.experience.create);
  const updateExperience = useMutation(api.experience.update);
  const deleteExperience = useMutation(api.experience.remove);
  const updateProfile = useMutation(api.users.updateMe);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<Id<"experiences"> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<Id<"experiences"> | null>(null);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("experiences");
  const [profileForm, setProfileForm] = useState({ major: "", graduationYear: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        major: user.major ?? "",
        graduationYear: user.graduationYear ?? "",
      });
    }
  }, [user]);

  const sortedExperiences = useMemo(
    () => [...(user?.experiences ?? [])].sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0)),
    [user?.experiences]
  );

  const handleChange =
    (field: keyof ExperienceForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        field === "currentlyWorking" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;

      setForm((current) => {
        if (field === "currentlyWorking") {
          return {
            ...current,
            currentlyWorking: value as boolean,
            endMonth: value ? "" : current.endMonth,
            endYear: value ? "" : current.endYear,
          };
        }

        return { ...current, [field]: value };
      });
    };

  const handleProfileChange =
    (field: "major" | "graduationYear") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setProfileForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingExperienceId(null);
  };

  const openAddExperienceDialog = () => {
    resetForm();
    setIsExperienceDialogOpen(true);
  };

  const closeExperienceDialog = () => {
    if (isSubmitting) {
      return;
    }

    setIsExperienceDialogOpen(false);
    resetForm();
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperienceId(experience.id as Id<"experiences">);
    setForm(getFormFromExperience(experience));
    setIsExperienceDialogOpen(true);
  };

  const handleDelete = async (experienceId: Id<"experiences">) => {
    setIsDeletingId(experienceId);

    try {
      await deleteExperience({ experienceId });
      await refreshUser();
      if (editingExperienceId === experienceId) {
        resetForm();
      }
      toast.success("Experience deleted successfully!");
    } catch (error) {
      toast.error("Delete experience failed: " + (error as Error).message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const organization = form.organization.trim();
    const description = form.description.trim();

    if (!title || !organization) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateDates(form.startMonth, form.startYear, form.endMonth, form.endYear, form.currentlyWorking)) {
      return;
    }

    const startDate = `${form.startMonth} ${form.startYear}`;
    const endDate = form.currentlyWorking ? "Present" : `${form.endMonth} ${form.endYear}`;

    setIsSubmitting(true);

    try {
      if (editingExperienceId !== null) {
        await updateExperience({
          experienceId: editingExperienceId,
          title,
          organization,
          startDate,
          endDate,
          description: description || undefined,
        });
        toast.success("Experience updated successfully!");
      } else {
        await createExperience({
          title,
          organization,
          startDate,
          endDate,
          description: description || undefined,
        });
        toast.success("Experience added successfully!");
      }

      await refreshUser();
      resetForm();
      setIsExperienceDialogOpen(false);
    } catch (error) {
      const prefix = editingExperienceId !== null ? "Update experience failed: " : "Add experience failed: ";
      toast.error(prefix + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const major = profileForm.major.trim();
    const graduationYear = profileForm.graduationYear.trim();

    if (!major || !graduationYear) {
      toast.error("Enter both your major and graduation year.");
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateProfile({ major, graduationYear });
      await refreshUser();
      toast.success("Profile details updated.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <p className="font-serif text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { major, graduationYear, accentClass, initials } = getMemberMeta(user);

  return (
    <div className="min-h-full w-full bg-[#f7f2eb] text-[#10244d]">
      <section className="bg-[#300811] px-12 py-12 text-[#fff8ee]">
        <div className="mx-auto flex max-w-6xl items-center gap-8">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-medium ${accentClass}`}>
            {initials}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#f0cf86]">My Profile</p>
            <h1 className="mt-3 font-serif text-4xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-2 text-lg text-[#d0b4a4]">{user.email}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {major ? <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">{major}</span> : null}
              {graduationYear ? (
                <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">
                  Class of {graduationYear}
                </span>
              ) : null}
              <span className="rounded-xl border border-[#6a4e45] bg-[#3a1a0f] px-4 py-2 text-sm text-[#f0cf86]">Theta Chapter</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-12 py-12">
        <div className="mb-8 flex gap-3 rounded-[24px] border border-[#e5dac8] bg-white p-2">
          <button
            type="button"
            onClick={() => setActiveTab("experiences")}
            className={`h-12 flex-1 rounded-2xl text-sm font-medium transition ${
              activeTab === "experiences"
                ? "bg-[#300811] text-[#fff8ee]"
                : "text-[#5f7191] hover:bg-[#fbfaf7]"
            }`}
          >
            Experiences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`h-12 flex-1 rounded-2xl text-sm font-medium transition ${
              activeTab === "settings"
                ? "bg-[#300811] text-[#fff8ee]"
                : "text-[#5f7191] hover:bg-[#fbfaf7]"
            }`}
          >
            Profile Settings
          </button>
        </div>

        {activeTab === "experiences" ? (
        <section className="rounded-[28px] border border-[#e5dac8] bg-white p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Your Experiences</p>
              <h2 className="mt-3 font-serif text-2xl text-[#10244d]">Experience</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#f8f3e7] px-4 py-2 text-sm text-[#8f6710]">
                {sortedExperiences.length} entries
              </span>
              <button
                type="button"
                onClick={openAddExperienceDialog}
                className="h-11 rounded-xl bg-[#300811] px-5 text-sm font-medium text-[#fff8ee] transition hover:bg-[#571120]"
              >
                Add experience
              </button>
            </div>
          </div>

          {sortedExperiences.length > 0 ? (
            <div className="mt-8 space-y-5">
              {sortedExperiences.map((experience) => (
                <div key={experience.id} className="rounded-[24px] border border-[#e8dfd1] bg-[#fffdf9] p-6">
                  <h3 className="text-xl font-semibold text-[#10244d]">{experience.title}</h3>
                  <p className="mt-2 text-base text-[#5f7191]">{experience.organization}</p>
                  <p className="mt-2 text-sm text-[#97a2b7]">
                    {experience.startDate} - {experience.endDate}
                  </p>
                  {experience.description ? (
                    <p className="mt-4 text-sm leading-7 text-[#5f7191]">{experience.description}</p>
                  ) : null}

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(experience)}
                      className="rounded-xl border border-[#ddd4c6] px-4 py-2 text-sm text-[#5f7191] transition hover:bg-[#fbfaf7]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingId === experience.id}
                      onClick={() => handleDelete(experience.id as Id<"experiences">)}
                      className="rounded-xl border border-[#ead6d1] px-4 py-2 text-sm text-[#9b4b43] transition hover:bg-[#fff5f2] disabled:opacity-60"
                    >
                      {isDeletingId === experience.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#d7dce6] bg-[#fbfaf7] p-6 text-[#61728f]">
              No experiences added yet. Add one to start building out your profile.
            </div>
          )}
        </section>
        ) : (
          <section className="rounded-[28px] border border-[#e5dac8] bg-white px-8 py-10">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">Profile Settings</p>
                <h2 className="mt-3 font-serif text-3xl text-[#10244d]">Academic details</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5f7191]">
                  Keep your major and graduation year current for the member directory.
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-[#e8dfd1] bg-[#fffdf9] p-6">
                <div className="mb-6 flex items-center gap-4 border-b border-[#eee4d8] pb-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-medium ${accentClass}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-[#10244d]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-sm text-[#61728f]">{user.email}</p>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleProfileSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Major</label>
                      <input
                        type="text"
                        value={profileForm.major}
                        onChange={handleProfileChange("major")}
                        placeholder="Computer Science"
                        className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-white px-4 text-base text-[#10244d] outline-none placeholder:text-[#8a97ad]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Graduation year</label>
                      <input
                        type="text"
                        value={profileForm.graduationYear}
                        onChange={handleProfileChange("graduationYear")}
                        placeholder="2026"
                        className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-white px-4 text-base text-[#10244d] outline-none placeholder:text-[#8a97ad]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="h-12 w-full rounded-2xl bg-[#300811] text-sm font-medium text-[#fff8ee] transition hover:bg-[#571120] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingProfile ? "Saving..." : "Save academic details"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </div>

      {isExperienceDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeExperienceDialog();
            }
          }}
        >
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#e5dac8] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[#61728f]">
                  {editingExperienceId !== null ? "Edit Experience" : "Add Experience"}
                </p>
                <h2 id="experience-dialog-title" className="mt-3 font-serif text-2xl text-[#10244d]">
                  {editingExperienceId !== null ? "Update role or project" : "New role or project"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5f7191]">
                  Add an internship, research role, leadership position, or club project. Use Present if you are still in the role.
                </p>
              </div>

              <button
                type="button"
                onClick={closeExperienceDialog}
                className="h-10 rounded-xl border border-[#ddd4c6] px-4 text-sm text-[#5f7191] transition hover:bg-[#fbfaf7]"
              >
                Close
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  placeholder="Software Engineer Intern"
                  className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base text-[#10244d] outline-none placeholder:text-[#8a97ad]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Organization</label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={handleChange("organization")}
                  placeholder="Stripe"
                  className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-base text-[#10244d] outline-none placeholder:text-[#8a97ad]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Start month</label>
                  <select
                    value={form.startMonth}
                    onChange={handleChange("startMonth")}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-sm text-[#10244d] outline-none"
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Start year</label>
                  <select
                    value={form.startYear}
                    onChange={handleChange("startYear")}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-sm text-[#10244d] outline-none"
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 py-3 text-sm text-[#5f7191]">
                <input
                  type="checkbox"
                  checked={form.currentlyWorking}
                  onChange={handleChange("currentlyWorking")}
                  className="h-4 w-4 rounded border-[#cdbda7]"
                />
                I currently work here
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">End month</label>
                  <select
                    value={form.endMonth}
                    onChange={handleChange("endMonth")}
                    disabled={form.currentlyWorking}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-sm text-[#10244d] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{form.currentlyWorking ? "Present" : "Month"}</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">End year</label>
                  <select
                    value={form.endYear}
                    onChange={handleChange("endYear")}
                    disabled={form.currentlyWorking}
                    className="h-12 w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 text-sm text-[#10244d] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{form.currentlyWorking ? "Present" : "Year"}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e6f8d]">Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Worked on..."
                  rows={5}
                  className="w-full rounded-2xl border border-[#ddd4c6] bg-[#fbfaf7] px-4 py-3 text-base text-[#10244d] outline-none placeholder:text-[#8a97ad]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-2xl bg-[#300811] text-base font-medium text-[#fff8ee] transition hover:bg-[#571120] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : editingExperienceId !== null ? "Save changes" : "Add experience"}
                </button>

                <button
                  type="button"
                  onClick={closeExperienceDialog}
                  className="h-12 rounded-2xl border border-[#ddd4c6] px-5 text-sm text-[#5f7191] transition hover:bg-[#fbfaf7]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
