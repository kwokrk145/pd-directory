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
                <div className="flex h-12 min-w-55 transition hover:bg-gray-600 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 px-6 py-3 text-center">
                    <h1>Browse the Directory</h1>
                </div>
                <div className="flex h-12 min-w-55 transition hover:bg-gray-600 cursor-pointer items-center justify-center rounded-2xl border border-gray-100 px-6 py-3 text-center">
                    <h1>Create your Profile</h1>
                </div>

            </div>
        
        </div>

      </section>
    </div>
  );
};

export default Home;
