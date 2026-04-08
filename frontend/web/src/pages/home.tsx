import { Button } from "../components/ui/button";
import { navigateToPage } from "../lib/store";


const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Front Title Section*/}
      <div className="flex flex-col p-4 items-center px-8 min-h-[50vh] py-18 bg-[url('/brody.jpg')] bg-no-repeat bg-cover bg-center rounded-lg shadow-lg m-8">
        <div className="flex flex-col text-white font-bold p-8  ">
          <p className="font-bold text-6xl">Theta Tau Directory</p>
          <p className="text-2xl mt-4 font-bold">@ Johns Hopkins University</p>
        </div>
        <Button onClick={() => navigateToPage("members")} className="w-full sm:w-1/2 md:w-1/4 mt-auto ml-0 text-white bg-black text-base border-white border cursor-pointer hover-lift">Meet Our Members</Button>
      </div>

      {/* Where Members Have Worked Section*/}
      <div className="flex flex-wrap items-baseline gap-3 ml-6 md:ml-12 mb-8">
        <p className="text-4xl font-bold leading-tight">Member Experience</p>
        <p className="text-xl text-gray-500 leading-tight">
          - Current & Former Members in Industry and Academia (and more!)
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full justify-center items-center px-8 mb-12 gap-8">
        <div className="flex flex-col p-12 w-full rounded-lg shadow-lg ">
          <p className="text-lg font-bold text-center mb-8">Universities</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-8">
            <div className="exp-box">MIT</div>
            <div className="exp-box">Stanford</div>
            <div className="exp-box">Harvard</div>
            <div className="exp-box">UPenn</div>
            <div className="exp-box">UCSF</div>
            <div className="exp-box">UT Austin</div>
            <div className="exp-box">UC Santa Barbara</div>
            <div className="exp-box">Northwestern</div>
            <div className="exp-box">Georgia Tech</div>
          </div>
        </div>
        <div className="flex flex-col p-12 w-full rounded-lg shadow-lg ">
          <p className="text-lg font-bold text-center mb-8">Companies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-8">
            <div className="exp-box">Google</div>
            <div className="exp-box">Amazon</div>
            <div className="exp-box">JHU APL</div>
            <div className="exp-box">AstraZeneca</div>
            <div className="exp-box">Honda</div>
            <div className="exp-box">Johnson & Johnson</div>
            <div className="exp-box">JP Morgan</div>
            <div className="exp-box">Evercore</div>
            <div className="exp-box">Gong Cha</div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col w-full ml-12 mb-12 gap-8">
        <p className="w-3/4 font-bold text-4xl">About Theta Tau</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 md:justify-start justify-center">
          <div className="flex flex-col w-3/4 text-lg text-gray-500 gap-8">
            <p>
              Founded on the principles of brotherhood, professionalism, and service, Theta Tau brings together engineering students from all disciplines to form a comprehensive professional development organization.
            </p>
            <p>
              Whether you're interested in aerospace, computer science, mechanical, electrical, or any other engineering discipline, Theta Tau provides the resources, connections, and support to help you achieve your goals.
            </p>
            <p>
              Our members engage in technical workshops, networking events, community service projects, and social activities that foster both professional growth and lasting friendships. We believe that the best engineers are well-rounded individuals who can communicate effectively, work in teams, and contribute positively to their communities.
            </p>
          </div>
          <img src="/ThetaTau.png" alt="Logo" className="w-48 h-48 object-contain md:ml-4 md:mb-16" />

        </div>
        
      </div>
        
    </div>


  );
};

export default Home;