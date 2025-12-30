import { Button } from "../components/ui/button";


const Home = () => {
  return (
    <div className="flex flex-col p-4 items-center px-8 min-h-[50vh] py-18 bg-[url('/brody.jpg')] bg-no-repeat bg-cover bg-center rounded-lg shadow-lg m-8">
        <div className="flex flex-col text-white font-bold p-8 ">
          <p className="font-bold text-6xl">Theta Tau Alumni Directory</p>
          <p className="text-2xl mt-4 font-bold">@ Johns Hopkins University</p>
        </div>
        <Button className="w-1/4 mt-auto ml-8 text-white cursor-pointer hover-lift">Meet Our Members</Button>
    </div>


  );
};

export default Home;