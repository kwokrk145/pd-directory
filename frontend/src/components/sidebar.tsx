export const Sidebar = () => {
  return (
    <div className="bg-[#0F2044] p-2 flex flex-row border-b border-white ">
        <div className="px-6 flex w-full gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-[#B8972A] text-lg text-[#0F2044]">
            <span className="font-normal font-serif text-white">θT</span>
            </div>

            <div className="flex flex-col">
            <h1 className="font-serif text-xl font-normal text-white">Theta Tau</h1>
            <p className="text-[11px] tracking-[0.08em] text-gray-300 uppercase">Johns Hopkins</p>
            </div>
        </div>
        <div className="flex font-serif text-white items-center ml-auto whitespace-nonwrap gap-3 px-6">
            <div className="h-10 min-w-25 border-gray-500 text-center whitespace-nowrap border p-2 rounded-xl transition cursor-pointer hover:bg-gray-600">
                Directory
            </div>
            <div className="h-10 min-w-25 border-gray-500 text-center whitespace-nowrap border p-2 rounded-xl transition cursor-pointer hover:bg-gray-600">
                Sign in
            </div>
            <div className="h-10 min-w-25 border-gray-500 text-center whitespace-nowrap border p-2 rounded-xl transition cursor-pointer hover:bg-gray-600">
                Join
            </div>
        </div>

    </div>
  );
};
