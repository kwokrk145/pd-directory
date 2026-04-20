import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/use-auth";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate("/");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-row border-b border-[#f0cf86]/18 bg-[#300811] py-4">
      <div onClick={() => navigate("/")} className="flex w-full cursor-pointer gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f0cf86] bg-[#f0cf86] text-lg text-[#300811]">
          <span className="font-serif font-normal text-[#300811]">θT</span>
        </div>

        <div className="flex flex-col">
          <h1 className="font-serif text-xl font-normal text-[#fff8ee]">Theta Tau</h1>
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#e2c8b1]">Johns Hopkins</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 px-6 font-serif text-[#fff8ee]">
        <div
          onClick={() => navigate("/directory")}
          className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]"
        >
          Directory
        </div>
        {isAuthenticated ? (
          <>
            <div
              onClick={() => navigate("/profile")}
              className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]"
            >
              Profile
            </div>
            <div
              onClick={() => navigate("/members/admin")}
              className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]"
            >
              Members
            </div>
            <div
              onClick={handleLogout}
              className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/70 bg-[#f0cf86] p-2 text-center text-[#300811] transition hover:bg-[#f6dc9d]"
            >
              Log out
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => navigate("/login")}
              className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]"
            >
              Sign in
            </div>
            <div
              onClick={() => navigate("/register")}
              className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/70 bg-[#f0cf86] p-2 text-center text-[#300811] transition hover:bg-[#f6dc9d]"
            >
              Join
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
