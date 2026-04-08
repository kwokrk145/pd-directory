export const Home = () => {
  return (
    <div>
      <div className="h-px-[13px] bg-white" />

      <section className="bg-[#0F2044]">
        <div className="mx-auto flex h-[50vh] flex-col items-center justify-center gap-8 py-12">
          <div className="rounded-4xl border border-[#B8972A] px-6 py-3 ">
            <h1 className="font-serif text-base text-center leading-none text-[#B8972A]">
              MEMBER DIRECTORY EST. 1942
            </h1>
          </div>
            <h1 className="text-center leading-tight text-5xl font-serif text-white">
                Connect with the <span className="text-[#B8972A]">Theta Tau</span>
                <br />
                Network at Hopkins
            </h1>
            <h2 className="text-center font-serif text-base text-gray-500">
              Find classmates, alumni, research mentors, and internship 
              <br />
              connections across every discipline in engineering
            </h2>
            <div className="flex flex-row items-center justify-center gap-4 font-serif text-white">
                <div className="flex h-12 min-w-55 transition hover:bg-gray-600 cursor-pointer items-center justify-center rounded-2xl border border-gray-500 px-6 py-3 text-center">
                    <h1>Browse the Directory</h1>
                </div>
                <div className="flex h-12 min-w-55 transition hover:bg-gray-600 cursor-pointer items-center justify-center rounded-2xl border border-gray-500 px-6 py-3 text-center">
                    <h1>Create your Profile</h1>
                </div>

            </div>
        
        </div>

      </section>
      <section className="bg-[#2F3E6B] h-[20vh] flex flex-row text-3xl font-serif  text-white items-center justify-center">
        <div className="flex flex-col w-1/3 text-center border border-gray-600 h-full justify-center">
            <h1>
                240+
            </h1>
            <h2 className="text-base text-gray-500">
                Active members and alumni
            </h2>
        </div>
        <div className="flex justify-center h-full border-gray-600 border flex-col w-1/3 text-center">
            <h1>
                60+
            </h1>
            <h2 className="text-base  text-gray-500">
                Companies represented
            </h2>
        </div>
        <div className="flex flex-col justify-center h-full border border-gray-600 w-1/3 text-center">
            <h1>
                12
            </h1>
            <h2 className="text-base text-gray-500">
                Graduate programs
            </h2>
        </div>

      </section>
    </div>
  );
};

export default Home;
