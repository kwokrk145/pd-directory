import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row border-b border-[#f0cf86]/18 bg-[#300811] py-4">
      <div className="flex w-full gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f0cf86] bg-[#f0cf86] text-lg text-[#300811]">
          <span className="font-serif font-normal text-[#300811]">θT</span>
        </div>

        <div className="flex flex-col">
          <h1 className="font-serif text-xl font-normal text-[#fff8ee]">Theta Tau</h1>
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#e2c8b1]">Johns Hopkins</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 px-6 font-serif text-[#fff8ee]">
        <div className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]">
          Directory
        </div>
        <div onClick={() => navigate("/login")} className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/22 bg-white/6 p-2 text-center transition hover:bg-[#571120]">
          Sign in
        </div>
        <div onClick={() => navigate("/register")} className="min-w-25 cursor-pointer whitespace-nowrap rounded-xl border border-[#f0cf86]/70 bg-[#f0cf86] p-2 text-center text-[#300811] transition hover:bg-[#f6dc9d]">
          Join
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
