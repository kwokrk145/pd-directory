const loginHighlights = [
  {
    title: "Edit your profile",
    description: "Add and update internships, research, and experiences",
    icon: "○",
  },
  {
    title: "Full directory access",
    description: "Browse every member and alumni profile in the chapter",
    icon: "◷",
  },
  {
    title: "Chapter resources",
    description: "Access alumni connections, referrals, and mentorship",
    icon: "?",
  },
];

export const Login = () => {
  return (
    <div className="flex min-h-full w-full flex-1 overflow-hidden">
      <div className="flex min-h-full w-1/2 items-center justify-center border-r border-[#f0cf86]/12 bg-[#300811] px-6 py-8">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="rounded-3xl border border-[#f0cf86]/20 bg-[#3a1a0f] px-4 py-2">
            <h1 className="font-serif text-base text-[#f0cf86]">• MEMBERS ONLY</h1>
          </div>

          <h1 className="font-serif text-3xl leading-tight text-[#fff8ee]">
            Your Chapter&apos;s Professional <span className="text-[#f0cf86]">Record</span>
          </h1>

          <p className="font-serif text-base leading-7 text-[#e2c8b1]">
            Login to manage your profile and update your experiences.
          </p>

          <div className="space-y-5 pt-1">
            {loginHighlights.map((item) => (
              <div key={item.title} className="flex flex-colitems-start gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#f0cf86]/12 bg-white/4 text-lg text-[#f0cf86]">
                  <span>{item.icon}</span>
                </div>

                <div className="max-w-lg">
                  <h2 className="font-sans text-lg font-semibold text-[#fff8ee]">{item.title}</h2>
                  <p className="mt-1 font-sans text-sm leading-6 text-[#b99f92]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-full w-1/2 items-center justify-center bg-[#f7f2eb] px-6 py-8 text-[#10244d]">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7f9e]">Member Sign-In</p>

          <h1 className="mt-4 font-serif text-3xl tracking-tight text-[#10244d]">
            Welcome back
          </h1>

          <p className="mt-3 max-w-md font-serif text-base leading-7 text-[#6c7c97]">
            Sign in to edit your profile and manage your experiences.
          </p>

          <form className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Email address</label>
              <input
                type="email"
                placeholder="you@jhu.edu"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-serif text-base font-medium text-[#5e6f8d]">Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-2xl border transition hover:bg-gray-300 cursor-pointer border-[#efe4d1] bg-[#f4ede3] font-serif text-base text-black"
            >
              Sign in to your account
            </button>
          </form>

          <div className="mt-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ddd4c6]" />
            <p className="font-serif text-sm text-[#8a97ad]">good to know</p>
            <div className="h-px flex-1 bg-[#ddd4c6]" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#e6dccb] bg-white/35 p-5">
            <p className="font-serif text-sm leading-6 text-[#61728f]">
              <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-[#63b37d] align-middle" />
              <span className="text-[#10244d]">These profiles are public!</span> Anyone can view member profiles and
              experiences. Signing in is only for editing purposes.
            </p>
          </div>

          <p className="mt-6 text-center font-sans text-sm text-[#61728f]">
            Not a member yet?{" "}
            <button type="button" className="font-semibold cursor-pointer text-[#10244d] underline underline-offset-4">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
