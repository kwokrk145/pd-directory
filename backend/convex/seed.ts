import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

type SeedExperience = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description?: string;
};

type SeedUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  major: string;
  graduationYear: string;
  experiences: SeedExperience[];
};

type SeedMember = {
  firstName: string;
  lastName: string;
  role: number;
};

const seedUsers: SeedUser[] = [
  {
    firstName: "Miles",
    lastName: "Carter",
    email: "miles.carter@jhu.edu",
    role: 101,
    major: "Computer Science",
    graduationYear: "2026",
    experiences: [
      {
        title: "Software Engineering Intern",
        organization: "Figma",
        startDate: "May 2025",
        endDate: "Aug 2025",
        description: "Built internal tooling for design systems and component quality checks.",
      },
      {
        title: "Teaching Assistant",
        organization: "Johns Hopkins University",
        startDate: "Jan 2025",
        endDate: "May 2025",
        description: "Led office hours for data structures and mentored first-year students.",
      },
    ],
  },
  {
    firstName: "Ethan",
    lastName: "Nguyen",
    email: "ethan.nguyen@jhu.edu",
    role: 102,
    major: "Biomedical Engineering",
    graduationYear: "2027",
    experiences: [
      {
        title: "Research Assistant",
        organization: "Hopkins BME Design Lab",
        startDate: "Sep 2024",
        endDate: "Present",
        description: "Worked on wearable sensing prototypes for post-op recovery tracking.",
      },
      {
        title: "Product Intern",
        organization: "Medtronic",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description: "Supported product validation workflows for patient monitoring tools.",
      },
    ],
  },
  {
    firstName: "Jordan",
    lastName: "Brooks",
    email: "jordan.brooks@jhu.edu",
    role: 103,
    major: "Applied Mathematics and Statistics",
    graduationYear: "2026",
    experiences: [
      {
        title: "Quantitative Analyst Intern",
        organization: "BlackRock",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description: "Automated portfolio analysis dashboards and data validation checks.",
      },
      {
        title: "Peer Mentor",
        organization: "Center for Leadership Education",
        startDate: "Aug 2024",
        endDate: "Present",
        description: "Coached students on startup problem framing and product thinking.",
      },
    ],
  },
  {
    firstName: "Noah",
    lastName: "Patel",
    email: "noah.patel@jhu.edu",
    role: 104,
    major: "Mechanical Engineering",
    graduationYear: "2027",
    experiences: [
      {
        title: "Manufacturing Engineering Intern",
        organization: "Tesla",
        startDate: "May 2025",
        endDate: "Aug 2025",
        description: "Improved fixture tracking and process documentation on pilot lines.",
      },
      {
        title: "Project Lead",
        organization: "Hopkins Baja Team",
        startDate: "Sep 2024",
        endDate: "Present",
        description: "Led subsystem design reviews and sponsor presentations.",
      },
    ],
  },
  {
    firstName: "Lucas",
    lastName: "Reed",
    email: "lucas.reed@jhu.edu",
    role: 105,
    major: "Economics",
    graduationYear: "2026",
    experiences: [
      {
        title: "Strategy Intern",
        organization: "Deloitte",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description: "Researched market entry opportunities and built executive slide decks.",
      },
      {
        title: "Finance Director",
        organization: "Student Ventures",
        startDate: "Jan 2025",
        endDate: "Present",
        description: "Managed budgets, partner outreach, and investor event logistics.",
      },
    ],
  },
  {
    firstName: "Aiden",
    lastName: "Foster",
    email: "aiden.foster@jhu.edu",
    role: 106,
    major: "Public Health Studies",
    graduationYear: "2028",
    experiences: [
      {
        title: "Community Health Fellow",
        organization: "Baltimore Health Corps",
        startDate: "Jan 2025",
        endDate: "Present",
        description: "Coordinated outreach programming and analyzed community health data.",
      },
      {
        title: "Operations Intern",
        organization: "Kaiser Permanente",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description: "Documented clinic workflow bottlenecks and drafted improvement proposals.",
      },
    ],
  },
];

const approvedOnlyMembers: SeedMember[] = [
  { firstName: "Caleb", lastName: "Ward", role: 107 },
  { firstName: "Henry", lastName: "Price", role: 108 },
];

async function upsertMember(
  ctx: MutationCtx,
  member: SeedMember,
) {
  const existingMember = await ctx.db
    .query("members")
    .withIndex("by_role", (q) => q.eq("role", member.role))
    .unique();

  if (existingMember) {
    await ctx.db.patch(existingMember._id, {
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
    });
    return existingMember._id;
  }

  return await ctx.db.insert("members", member);
}

async function upsertUser(
  ctx: MutationCtx,
  user: SeedUser,
) {
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_role", (q) => q.eq("role", user.role))
    .unique();

  const userFields = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    major: user.major,
    graduationYear: user.graduationYear,
  };

  if (existingUser) {
    await ctx.db.patch(existingUser._id, userFields);
    return existingUser._id;
  }

  return await ctx.db.insert("users", userFields);
}

async function replaceExperiences(
  ctx: MutationCtx,
  userId: Id<"users">,
  experiences: SeedExperience[],
) {
  const existingExperiences = await ctx.db
    .query("experiences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  for (const experience of existingExperiences) {
    await ctx.db.delete(experience._id);
  }

  for (const experience of experiences) {
    await ctx.db.insert("experiences", {
      userId,
      title: experience.title,
      organization: experience.organization,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
    });
  }

  return existingExperiences.length;
}

export const seedDirectory = internalMutation({
  args: {
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const reset = args.reset ?? true;
    const seededRoles = new Set<number>([
      ...seedUsers.map((user) => user.role),
      ...approvedOnlyMembers.map((member) => member.role),
    ]);

    let membersUpserted = 0;
    let usersUpserted = 0;
    let experiencesCreated = 0;
    let experiencesRemoved = 0;

    for (const user of seedUsers) {
      await upsertMember(ctx, {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
      membersUpserted += 1;

      const userId = await upsertUser(ctx, user);
      usersUpserted += 1;

      if (reset) {
        experiencesRemoved += await replaceExperiences(ctx, userId, user.experiences);
        experiencesCreated += user.experiences.length;
      } else {
        const existingExperiences = await ctx.db
          .query("experiences")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

        if (existingExperiences.length === 0) {
          for (const experience of user.experiences) {
            await ctx.db.insert("experiences", {
              userId,
              title: experience.title,
              organization: experience.organization,
              startDate: experience.startDate,
              endDate: experience.endDate,
              description: experience.description,
            });
          }
          experiencesCreated += user.experiences.length;
        }
      }
    }

    for (const member of approvedOnlyMembers) {
      await upsertMember(ctx, member);
      membersUpserted += 1;
    }

    const seededUsersSnapshot = await ctx.db.query("users").collect();
    const seededMembersSnapshot = await ctx.db.query("members").collect();
    const seededExperiencesSnapshot = await ctx.db.query("experiences").collect();

    return {
      reset,
      scopedRoles: [...seededRoles].sort((a, b) => a - b),
      membersUpserted,
      usersUpserted,
      experiencesCreated,
      experiencesRemoved,
      totals: {
        users: seededUsersSnapshot.filter((user) => user.role !== undefined && seededRoles.has(user.role)).length,
        members: seededMembersSnapshot.filter((member) => seededRoles.has(member.role)).length,
        experiences: seededExperiencesSnapshot.filter((experience) =>
          seededUsersSnapshot.some((user) => user._id === experience.userId && user.role !== undefined && seededRoles.has(user.role)),
        ).length,
      },
    };
  },
});
