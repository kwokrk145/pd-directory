# PD Directory Implementation Plan

This document is a step-by-step plan for the next major features:

- search by keyword
- pagination
- add/edit experience in a dialog
- admin-managed approved member list
- email verification
- reset password
- real-time landing page company/university highlights
- mobile-friendly responsive layouts
- migration from the current Express/Prisma backend to Convex

## Current Codebase Snapshot

The repo currently has three main areas:

- `frontend/`: the newer React app. This appears to be the app to continue building because it uses `react-router-dom`, has the current directory/profile pages, and includes profile editing.
- `web/`: an older or alternate React app. It has useful shadcn/Radix dialog components that can be copied or recreated in `frontend`.
- `api/`: the current Express + Prisma + PostgreSQL backend. It handles session auth, users, profiles, and experiences.

Important current files:

- `frontend/src/pages/directory.tsx`: loads all users and renders member cards.
- `frontend/src/pages/home.tsx`: landing page. This should eventually show real-time top companies and universities from member data.
- `frontend/src/pages/profile.tsx`: handles profile details and add/edit/delete experience.
- `frontend/src/pages/login.tsx`: login UI.
- `frontend/src/pages/register.tsx`: registration UI.
- `frontend/src/hooks/auth-provider.tsx`: frontend auth state.
- `frontend/src/lib/api.ts`: API client for the Express backend.
- `api/src/routes/auth.ts`: register, login, logout, current user.
- `api/src/routes/profile.ts`: user listing, user profile fetch, profile update.
- `api/src/routes/experience.ts`: experience create, update, delete.
- `api/prisma/schema.prisma`: current database models.

## Recommended Build Order

Do the backend migration before adding search, pagination, admin gating, email verification, and password reset. Those features are mostly backend/auth features, so building them against Express/Prisma and then migrating to Convex would create duplicate work.

Recommended order:

1. Clean up project direction.
2. Add Convex.
3. Model data in Convex.
4. Migrate auth strategy.
5. Move profile and experience APIs to Convex.
6. Implement search and pagination.
7. Implement real-time landing page company/university highlights.
8. Convert add/edit experience to a dialog.
9. Build admin approved-member management.
10. Add email verification and password reset.
11. Verify mobile-friendly layouts across all main pages.
12. Retire the old Express API after parity is reached.

## Phase 1: Project Direction Cleanup

Goal: make it obvious which frontend is active.

Tasks:

1. Treat `frontend/` as the active app unless you intentionally decide otherwise.
2. Do not add new features to both `frontend/` and `web/`.
3. Move any reusable UI pieces from `web/` into `frontend/` only when needed.
4. Add a short note to the root `README.md` saying which app is active.
5. Optional later cleanup: archive or delete `web/` after `frontend/` fully replaces it.

Acceptance criteria:

- New feature work happens in one frontend app.
- A future reader can open the repo and know where to work.

## Phase 2: Add Convex

Goal: install Convex and connect it to `frontend/`.

Tasks:

1. Install Convex in `frontend/`.
2. Initialize Convex and create the `frontend/convex/` folder.
3. Add the generated Convex URL to the frontend environment file.
4. Wrap the React app in Convex's provider in `frontend/src/main.tsx`.
5. Confirm a simple test query works from the frontend.

Suggested target files:

- `frontend/package.json`
- `frontend/src/main.tsx`
- `frontend/src/env.ts`
- `frontend/convex/schema.ts`
- `frontend/convex/users.ts`

Acceptance criteria:

- `pnpm dev` runs the frontend.
- Convex dev server runs.
- A test Convex query can be called from the app.

References:

- Convex database overview: https://docs.convex.dev/database
- Convex indexes/query performance: https://docs.convex.dev/database/reading-data/indexes/indexes-and-query-perf
- Convex best practices: https://docs.convex.dev/understanding/best-practices

## Phase 3: Define Convex Data Model

Goal: replace the Prisma models with Convex tables.

Current Prisma models:

- `User`
- `Experience`

Recommended Convex tables:

```ts
users: {
  email: string;
  firstName: string;
  lastName: string;
  major?: string;
  graduationYear?: string;
  university?: string;
  emailVerified: boolean;
  role: "member" | "admin";
  createdAt: number;
  updatedAt: number;
}

experiences: {
  userId: Id<"users">;
  title: string;
  organization: string;
  organizationType?: "company" | "university" | "research" | "nonprofit" | "government" | "other";
  startDate: string;
  endDate: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

approvedMembers: {
  email: string;
  firstName?: string;
  lastName?: string;
  addedBy: Id<"users">;
  createdAt: number;
}
```

Recommended indexes:

- `users.by_email`
- `users.by_role`
- `users.by_university`
- `experiences.by_user`
- `experiences.by_organization`
- `experiences.by_organizationType`
- `approvedMembers.by_email`

Recommended search indexes:

- `users.search_name`: search over first name and last name.
- `users.search_profile`: search over major and graduation year if useful.
- `experiences.search_experience`: search over title, organization, and description if directory search should include experiences.

Acceptance criteria:

- Convex schema validates.
- Users can be found by email efficiently.
- Experiences can be listed by user efficiently.
- Landing page organization counts can be computed without relying on hardcoded values.
- Approved members can be found by email efficiently.

## Phase 4: Decide Auth Strategy

Goal: pick one auth approach before implementing account eligibility, email verification, or reset password.

You have two practical options:

### Option A: Use Convex with an Auth Provider

This is usually better for production because email verification and password reset are sensitive flows.

Possible providers:

- WorkOS AuthKit with Convex
- Clerk with Convex
- Auth0 with Convex

Pros:

- Email verification and reset password are mostly handled by the provider.
- Less custom security code.
- Easier to avoid password storage mistakes.

Cons:

- More setup.
- May require provider-specific dashboard configuration.

### Option B: Use Convex Auth / Custom Email Password Flow

This can be simpler if you want everything closer to the app, but you must be careful with verification tokens, reset tokens, expiration, and email sending.

Pros:

- More control.
- Fewer moving parts if configured well.

Cons:

- You own more security logic.
- You need a reliable email service.

Recommendation:

Use a managed auth provider with Convex if the goal is to ship a real member directory. Do not hand-roll password reset unless there is a strong reason.

Acceptance criteria:

- One auth provider is chosen.
- Login, register, logout, current user, email verification, and password reset all have a clear owner.
- The frontend `AuthProvider` is rewritten around the chosen auth system.

Reference:

- Convex + WorkOS AuthKit: https://docs.convex.dev/auth/authkit/

## Phase 5: Migrate Current Backend Features to Convex

Goal: reach feature parity with the current Express backend.

Tasks:

1. Replace `frontend/src/lib/api.ts` methods with Convex queries/mutations or create a new `frontend/src/lib/convex-api.ts`.
2. Implement current-user lookup.
3. Implement profile update for major and graduation year.
4. Implement experience create/update/delete.
5. Implement public member profile query.
6. Implement public directory query.
7. Update `frontend/src/hooks/auth-provider.tsx` to use Convex/auth provider data.
8. Update `frontend/src/pages/profile.tsx` and `frontend/src/pages/user-profile.tsx` to use Convex data.
9. Keep `api/` running until all frontend flows work on Convex.

Acceptance criteria:

- A user can sign in.
- A user can update major and graduation year.
- A user can add, edit, and delete experiences.
- Directory cards load from Convex.
- Public user profile pages load from Convex.
- No feature depends on Express for normal app usage.

## Phase 6: Search by Keyword

Goal: users can search directory members by keyword.

Recommended search behavior:

- Search input on `/directory`.
- Match against:
  - first name
  - last name
  - full name
  - major
  - graduation year
  - experience title
  - experience organization
  - experience description, optional

Implementation plan:

1. Add `searchTerm` state to `frontend/src/pages/directory.tsx`.
2. Debounce the input by about 250 ms so every keystroke does not trigger a query.
3. Add a Convex query like `members.searchDirectory`.
4. If `searchTerm` is empty, return paginated members ordered by newest or name.
5. If `searchTerm` is not empty, use Convex search indexes where possible.
6. Return only the fields needed for directory cards.
7. Show an empty state when there are no matches.

Important design decision:

If you want search to include experiences, you may need either:

- a denormalized `searchText` field on `users`, updated whenever profile or experiences change, or
- separate searches over `users` and `experiences`, then merge results.

Recommendation:

Start with member fields only: name, major, graduation year. Add experience search after basic search works.

Acceptance criteria:

- Typing a name filters results.
- Typing a major filters results.
- Clearing the input returns the default directory.
- Loading and empty states are clear.

## Phase 7: Pagination

Goal: avoid loading every member at once.

Recommended behavior:

- Show 12 or 24 members per page.
- Use "Load more" first because it is simpler and works naturally with cursor pagination.
- Add numbered pages only if you truly need direct page jumps.

Implementation plan:

1. Replace `getAllUsers()` with a paginated Convex query.
2. Store pagination cursor/result state in `frontend/src/pages/directory.tsx`.
3. Reset pagination when the search term changes.
4. Add a "Load more" button below the card grid.
5. Disable the button while loading.
6. Hide the button when there are no more results.

Acceptance criteria:

- Initial directory load fetches only the first page.
- Clicking "Load more" appends the next page.
- Searching resets back to page 1.
- The UI never duplicates cards across pages.

## Phase 8: Real-Time Landing Page Companies and Universities

Goal: the landing page section that lists companies and universities should use real member data instead of hardcoded names or counts.

Recommended behavior:

- On the landing page, display the top 8 companies represented by member experiences.
- Also display the top 8 universities represented by member profiles or education-related experiences.
- Counts should update automatically when users add, edit, or delete experiences.
- The UI should handle empty data gracefully while the member base is small.

Recommended data source:

- Companies should come from `experiences.organization` where `organizationType` is `"company"` or where the experience is clearly work-related.
- Universities should come from `users.university` if you add that profile field.
- If you do not want to add a `university` profile field yet, universities can temporarily come from `experiences.organization` where `organizationType` is `"university"`.

Implementation plan:

1. Add `university` to the user/profile model if you want every member to have a school affiliation.
2. Add `organizationType` to experiences so companies and universities can be counted separately.
3. Update the add/edit experience form to include organization type.
4. Add a Convex query like `stats.getLandingHighlights`.
5. In that query, aggregate counts by organization name.
6. Sort by count descending.
7. Return only the top 8 companies and top 8 universities.
8. Replace hardcoded landing page company/university content in `frontend/src/pages/home.tsx` with the Convex query result.
9. Show a fallback state if there are fewer than 8 entries.

Suggested return shape:

```ts
{
  companies: Array<{ name: string; count: number }>;
  universities: Array<{ name: string; count: number }>;
}
```

Important design decision:

Convex queries are real-time, so the landing page can update automatically when underlying member data changes. If the member base becomes large, consider maintaining a precomputed `organizationStats` table instead of recalculating counts from all users/experiences every time.

Acceptance criteria:

- Landing page no longer hardcodes company/university names.
- Top 8 companies are based on actual member experience data.
- Top 8 universities are based on actual member profile or education data.
- Counts update after relevant profile or experience changes.
- Empty and low-data states look intentional.

## Phase 9: Add/Edit Experience Dialog

Goal: replace the side textbox/form with a dialog.

Current state:

- `frontend/src/pages/profile.tsx` has the full experience form in the right sidebar.
- `web/src/components/ui/dialog.tsx` already has a Radix dialog component that can guide the implementation.

Recommended UI behavior:

- In the Experience section header, add an "Add experience" button.
- Clicking it opens a dialog with the existing form fields.
- Clicking "Edit" on an experience opens the same dialog prefilled.
- Submit creates or updates depending on whether `editingExperienceId` is set.
- Closing the dialog resets form state unless a submit is in progress.
- Delete can stay on the experience card.

Implementation plan:

1. Add dialog primitives to `frontend/src/components/ui/dialog.tsx`.
2. Extract the experience form from `frontend/src/pages/profile.tsx` into `frontend/src/components/experience-form-dialog.tsx`.
3. Move form state and validation into that component if it stays local, or keep state in `Profile` if that is faster.
4. Add `isExperienceDialogOpen` state.
5. Change `handleEdit` to set form state and open the dialog.
6. Change successful submit to refresh the user, close the dialog, and reset the form.
7. Remove the old sidebar experience form.
8. Keep the academic details form in the sidebar or move it into its own section.

Acceptance criteria:

- Add experience opens a dialog.
- Edit experience opens the same dialog with existing data.
- Cancel closes the dialog without saving.
- Successful create/update closes the dialog and refreshes the list.
- Validation messages still work.

## Phase 10: Admin Approved-Member Management

Goal: only people pre-approved by Theta Tau officials can create accounts.

Recommended model:

- `approvedMembers` is the source of truth for who can register.
- Registration checks `approvedMembers.by_email`.
- If the email is not approved, registration is blocked.
- Admins can add and delete approved member emails.

Admin access options:

1. Best: assign specific authenticated users the `admin` role in the database.
2. Acceptable for early development: require an admin password to access `/admin`, then use it to perform protected admin mutations.
3. Avoid for production: hardcoding an admin password in frontend code.

Recommendation:

Use an `admin` role on the user record. If you still want a password, store it server-side as an environment secret and only check it in a Convex action/mutation. Never expose it in frontend code.

Admin page behavior:

- Route: `/admin`
- Admin login or access check.
- Upload CSV of approved members.
- Manually add one approved email.
- List currently approved members.
- Delete an approved member.
- Optional: show whether that approved member has already created an account.

CSV format:

```csv
email,firstName,lastName
person1@jhu.edu,Jane,Doe
person2@jhu.edu,John,Smith
```

Implementation plan:

1. Add `approvedMembers` table and `by_email` index.
2. Add admin-only mutations:
   - `admin.addApprovedMember`
   - `admin.bulkAddApprovedMembers`
   - `admin.deleteApprovedMember`
   - `admin.listApprovedMembers`
3. Add helper function `requireAdmin(ctx)`.
4. Update registration to check approved email before creating user.
5. Create `frontend/src/pages/admin.tsx`.
6. Add `/admin` route in `frontend/src/App.tsx`.
7. Add CSV parsing on the frontend or backend. Backend validation is required either way.
8. Add clear duplicate handling:
   - duplicates in upload are skipped
   - existing approved emails are skipped
   - invalid emails are reported

Acceptance criteria:

- Non-approved email cannot register.
- Approved email can register.
- Admin can add one approved member.
- Admin can upload a CSV.
- Admin can delete approved members.
- Non-admin users cannot call admin mutations.

## Phase 11: Email Verification

Goal: users must verify their email after registration.

Recommended behavior:

- After registering, user sees "Check your email".
- User cannot edit profile or appear fully active until verified.
- Login can be allowed before verification, but protected actions should be blocked until verified.

Implementation depends on auth choice:

- If using WorkOS/Clerk/Auth0: configure email verification in the provider dashboard and read verified status in Convex.
- If custom: create verification tokens, email them, expire them, and mark `users.emailVerified = true` after successful verification.

Acceptance criteria:

- New accounts start unverified.
- Verification email is sent.
- Verification link marks the account as verified.
- Protected profile actions check verified status.
- The UI shows a useful message when verification is required.

## Phase 12: Reset Password

Goal: users can reset forgotten passwords.

Recommended behavior:

- Add "Forgot password?" button to `frontend/src/pages/login.tsx`.
- Route: `/reset-password` or provider-hosted reset page.
- User enters email.
- System sends reset link if account exists.
- Do not reveal whether an email exists in the UI.
- User sets a new password through the provider or a secure token flow.

Implementation depends on auth choice:

- Managed provider: use provider reset password flow.
- Custom auth: create reset tokens, hash tokens in storage, expire tokens, and invalidate after use.

Acceptance criteria:

- Login page has a reset password action.
- Reset request does not leak account existence.
- Valid reset link allows password update.
- Expired or reused reset links fail.

## Phase 13: Mobile-Friendly Responsive Layouts

Goal: every main page should work cleanly on phones, tablets, and desktop screens.

Responsive requirements:

- No horizontal scrolling on normal mobile widths.
- Text must stay inside its parent containers.
- Buttons and inputs must be easy to tap on mobile.
- Card grids should collapse from desktop multi-column layouts to one column on mobile.
- Dialogs should fit within the viewport and scroll internally if their content is long.
- Tables or admin lists should become stacked cards or horizontally scroll only inside a controlled table area.
- Header/sidebar navigation should remain usable on mobile.

Pages to verify:

- Landing page: `frontend/src/pages/home.tsx`
- Directory page: `frontend/src/pages/directory.tsx`
- My profile page: `frontend/src/pages/profile.tsx`
- Public user profile page: `frontend/src/pages/user-profile.tsx`
- Login page: `frontend/src/pages/login.tsx`
- Register page: `frontend/src/pages/register.tsx`
- Admin page after it is added: `frontend/src/pages/admin.tsx`

Implementation plan:

1. Audit current fixed-width and two-column layouts.
2. Replace desktop-only width assumptions like `w-1/2`, `grid-cols-3`, and large fixed padding with responsive Tailwind classes.
3. Use mobile-first classes, then add `md:` and `lg:` variants.
4. Directory cards should render as:
   - 1 column on mobile
   - 2 columns on tablet
   - 3 columns on desktop
5. Login/register split screens should stack vertically on mobile.
6. Profile layout should stack sections on mobile instead of keeping a sticky sidebar.
7. Experience dialog should use a max height like `max-h-[90vh]` and scrollable content.
8. Admin upload/list controls should stack on mobile.
9. Test at common widths: 375 px, 768 px, 1024 px, and desktop.

Acceptance criteria:

- The app is usable at 375 px wide.
- No page creates body-level horizontal scroll.
- Forms are readable and tappable on mobile.
- Directory, landing page, profile, auth, and admin pages all have intentional mobile layouts.
- Experience dialog works on mobile without cutting off submit/cancel actions.

## Phase 14: Retire Express/Prisma API

Goal: remove old backend only after Convex covers all live app flows.

Tasks:

1. Confirm `frontend` no longer imports `API_URL` or calls `fetch()` against the Express API.
2. Confirm all features work through Convex.
3. Move old `api/` docs into an archive note or remove the folder.
4. Update root `README.md`.
5. Remove old setup instructions for Prisma/Postgres if no longer needed.

Acceptance criteria:

- App runs with Convex only.
- README setup instructions match the actual project.
- No stale backend paths confuse future work.

## Suggested Milestones

Milestone 1: Convex foundation

- Convex installed.
- Schema defined.
- Basic current-user/profile query works.

Milestone 2: Feature parity

- Login/register/current user works.
- Profile update works.
- Experience create/update/delete works.
- Directory and user profile pages load from Convex.

Milestone 3: Directory improvements

- Search works.
- Pagination works.
- Directory has loading, empty, and error states.

Milestone 4: Landing page real-time data

- Landing page companies are generated from member experience data.
- Landing page universities are generated from member profile or experience data.
- Top 8 lists update automatically from Convex.

Milestone 5: Profile UX

- Add/edit experience uses a dialog.
- Old side form removed.
- Profile page layout is simpler.

Milestone 6: Admin and account eligibility

- Admin page exists.
- Approved-member list exists.
- Registration blocked unless email is approved.

Milestone 7: Account safety

- Email verification works.
- Reset password works.
- Protected actions respect verification/admin status.

Milestone 8: Mobile readiness

- Landing page, directory, profile, user profile, auth, and admin pages work on mobile.
- Dialogs and forms are usable at phone widths.
- No body-level horizontal scrolling.

## Risks and Decisions to Make Early

1. Auth provider choice

This affects registration, email verification, reset password, admin roles, and current-user lookup. Decide this before writing more auth code.

2. Search scope

Searching only member profile fields is straightforward. Searching experiences too is more complex. Start smaller.

3. Admin password

A shared admin password is okay for a temporary dev tool, but admin roles are cleaner and safer. Do not put admin secrets in frontend environment variables.

4. Two frontend folders

Keeping both `web/` and `frontend/` active will slow every feature. Pick one.

5. Data migration

If you already have real users in PostgreSQL, plan an export/import step. If the data is test data, recreate it in Convex seed/dev data.

6. Landing page aggregation strategy

Counting companies and universities directly from all documents is fine while the directory is small. If the dataset grows, use a precomputed stats table that updates when experiences or profiles change.

7. Mobile layout debt

Several current screens use desktop-first layouts. For example, login/register use fixed two-column halves, and the directory uses a three-column grid. These should be converted before final polish so new features do not inherit brittle layouts.

## Immediate Next Steps

1. Confirm `frontend/` is the app you want to continue.
2. Choose the auth approach for Convex.
3. Install and initialize Convex in `frontend/`.
4. Create `users`, `experiences`, and `approvedMembers` tables.
5. Port profile and experience flows from Express to Convex.
6. Build search and pagination on top of the new Convex directory query.
7. Connect the landing page company/university section to real-time Convex stats.
8. Extract the experience form into a dialog.
9. Make the main pages mobile-friendly and verify them at common phone/tablet widths.
