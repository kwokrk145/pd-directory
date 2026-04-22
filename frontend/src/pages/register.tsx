import { useEffect, useState, type ChangeEvent, type ComponentProps } from "react";
import { useConvex } from "convex/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@convex-api";
import useAuth from "../hooks/use-auth";
import { normalizeAuthErrorMessage } from "../lib/auth-errors";

const registerHighlights = [
  {
    title: "Build your profile",
    description: "smth smth relevant and important idk placeholder.",
    icon: "P",
  },
  {
    title: "Join the directory",
    description: "smth smth relevant and important idk placeholder",
    icon: "D",
  },
  {
    title: "Strengthen the network",
    description: "smth smth relevant and important idk placeholder.",
    icon: "+",
  },
];

type RegisterForm = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Register = () => {
  const convex = useConvex();
  const navigate = useNavigate();
  const { signUp, isAuthenticated } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleChange =
    (field: keyof RegisterForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const role = Number(form.role.trim());
    const email = form.email.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!firstName || !lastName || !form.role.trim() || !email || !password || !confirmPassword) {
      toast.error("Complete every field before creating your account.");
      return;
    }

    if (!Number.isInteger(role)) {
      toast.error("Enter your role number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const emailExists = await convex.query(api.users.emailExists, { email });
      if (emailExists) {
        toast.error("Email already exists.");
        return;
      }

      await signUp(firstName, lastName, email, password, role);
      toast.success("Account created successfully.");
      navigate("/profile");
    } catch (error) {
      toast.error(normalizeAuthErrorMessage(error, "signUp"));
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-89px)] w-full overflow-hidden">
      <div className="flex min-h-[calc(100dvh-89px)] w-1/2 items-center justify-center border-r border-[#f0cf86]/12 bg-[#300811] px-8 py-8">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="rounded-3xl border border-[#f0cf86]/20 bg-[#3a1a0f] px-4 py-2">
            <h1 className="font-serif text-base text-[#f0cf86]">Chapter Access</h1>
          </div>

          <h1 className="font-serif text-3xl leading-tight text-[#fff8ee]">
            Create your <span className="text-[#f0cf86]">Member Profile</span>
          </h1>

          <p className="font-serif text-base leading-7 text-[#e2c8b1]">
            Join the directory so members can learn from your work, experiences, and academic path.
          </p>

          <div className="space-y-5 pt-3">
            {registerHighlights.map((item) => (
              <div key={item.title} className="mb-7 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#f0cf86]/12 bg-white/4 text-sm font-semibold text-[#f0cf86]">
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

      <div className="flex min-h-[calc(100dvh-89px)] w-1/2 items-center justify-center bg-[#f7f2eb] px-8 py-8 text-[#10244d]">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7f9e]">Member Registration</p>

          <h1 className="mt-4 font-serif text-3xl tracking-tight text-[#10244d]">Create account</h1>

          <p className="mt-3 max-w-md font-serif text-base leading-8 text-[#6c7c97]">
            Set up your account to build your chapter profile and add your experiences.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  placeholder="John"
                  className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
                />
              </div>

              <div>
                <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  placeholder="Hopkins"
                  className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Role number</label>
              <input
                type="number"
                value={form.role}
                onChange={handleChange("role")}
                placeholder="123"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <div>
              <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@jhu.edu"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <div>
              <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="********"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <div>
              <label className="mb-2 block font-serif text-base font-medium text-[#5e6f8d]">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="********"
                className="h-12 w-full rounded-2xl bg-[#2f302d] px-4 font-serif text-base text-[#9fb0cb] outline-none placeholder:text-[#9fb0cb]"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-2xl border border-[#efe4d1] bg-[#f4ede3] font-serif text-base text-black transition hover:bg-gray-300"
            >
              Create your account
            </button>
          </form>

          <p className="mt-7 text-center font-sans text-sm text-[#61728f]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold text-[#10244d] underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
