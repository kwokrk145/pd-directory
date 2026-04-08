import type { UserType } from "../lib/types";
import { getMemberMeta } from "../lib/member-meta";

type ProfileCardProps = {
  user: UserType;
  onClick?: () => void;
};

export const ProfileCard = ({ user, onClick }: ProfileCardProps) => {
  const { major, graduationYear, accentClass, spotlight, initials } = getMemberMeta(user);
  // const secondaryText = spotlight
  //   ? `${spotlight.title} - ${spotlight.organization}`
  //   : [major, graduationYear ? `Class of ${graduationYear}` : ""].filter(Boolean).join(" - ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[28px] border border-[#eadfcd] bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-5">
        <div className={`flex h-18 w-18 shrink-0 items-center justify-center rounded-full text-4xl font-medium ${accentClass}`}>
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="font-sans text-xl font-semibold text-[#10244d]">
            {user.firstName} {user.lastName}
          </h3>
          {/* {secondaryText ? <p className="mt-1 text-xl leading-8 text-[#5d6f8d]">{secondaryText}</p> : null} */}

          <div className="mt-5 flex flex-wrap gap-3">
            {major ? <span className="rounded-xl border border-[#d7dce6] bg-[#f8f9fb] px-4 py-2 text-sm text-[#10244d]">{major}</span> : null}
            {graduationYear ? (
              <span className="rounded-xl border border-[#ead9a8] bg-[#faf4db] px-4 py-2 text-sm text-[#8f6710]">
                Class of {graduationYear}
              </span>
            ) : null}
            {spotlight ? (
              <span className="rounded-xl border border-[#d7dce6] bg-[#f8f9fb] px-4 py-2 text-sm text-[#10244d]">
                {spotlight.organization}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProfileCard;
