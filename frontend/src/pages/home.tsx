import { useState } from "react";
import Card from "../components/card";

const unis = [
  { name: "MIT", number: "14", initials: "MIT", label: "Members" },
  { name: "Stanford", number: "11", initials: "ST", label: "Members" },
  { name: "Harvard", number: "9", initials: "HA", label: "Members" },
  { name: "UPenn", number: "7", initials: "UP", label: "Members" },
  { name: "UCSF", number: "5", initials: "UC", label: "Members" },
  { name: "UT Austin", number: "8", initials: "UA", label: "Members" },
  { name: "Northwestern", number: "6", initials: "NO", label: "Members" },
  { name: "Georgia Tech", number: "10", initials: "GT", label: "Members" },
];

const companies = [
  { name: "Google", number: "18", initials: "G", label: "Members" },
  { name: "Amazon", number: "13", initials: "AM", label: "Members" },
  { name: "JHU APL", number: "16", initials: "JH", label: "Members" },
  { name: "AstraZeneca", number: "8", initials: "AZ", label: "Members" },
  { name: "Honda", number: "4", initials: "HO", label: "Members" },
  { name: "Applied Materials", number: "5", initials: "AM", label: "Members" },
  { name: "Johnson & Johnson", number: "7", initials: "J&J", label: "Members" },
  { name: "Gongcha", number: "Diana Phan", initials: "G", label: "Members" },
];

export const Home = () => {
  const [category, setCategory] = useState<"companies" | "schools">("companies");
  const displayedItems = category === "companies" ? companies : unis;

  return (
    <div>
      <div className="h-px bg-[#f0cf86]/18" />

      <section className="bg-[#300811] py-4">
        <div className="mx-auto flex h-[50vh] flex-col items-center justify-center gap-8 py-12">
          <div className="rounded-4xl border border-[#f0cf86]/75 px-6 py-3 ">
            <h1 className="font-serif text-base text-center leading-none text-[#f0cf86]">
              MEMBER DIRECTORY EST. 1942
            </h1>
          </div>
            <h1 className="text-center leading-tight text-5xl font-serif text-[#fff8ee]">
                Connect with the <span className="text-[#f0cf86]">Theta Tau</span>
                <br />
                Network at Hopkins
            </h1>
            <h2 className="text-center font-serif text-base text-[#e2c8b1]">
              Find classmates, alumni, research mentors, and internship 
              <br />
              connections across every discipline in engineering
            </h2>
            <div className="flex flex-row items-center justify-center gap-4 font-serif text-[#fff8ee]">
                <button className="flex h-12 min-w-55 cursor-pointer items-center justify-center rounded-2xl border border-[#f0cf86]/22 bg-white/6 px-6 py-3 text-center transition hover:bg-[#571120]">
                    <h1>Browse the Directory</h1>
                </button>
                <button className="flex h-12 min-w-55 cursor-pointer items-center justify-center rounded-2xl border border-[#f0cf86]/70 bg-[#f0cf86] px-6 py-3 text-center text-[#300811] transition hover:bg-[#f6dc9d]">
                    <h1>Create your Profile</h1>
                </button>

            </div>
        
        </div>

      </section>
      <section className="flex h-[20vh] flex-row items-center justify-center bg-[#571120] font-serif text-3xl text-[#fff8ee]">
        <div className="flex h-full w-1/3 flex-col justify-center border border-[#f0cf86]/12 text-center">
            <h1>
                240+
            </h1>
            <h2 className="text-base text-[#e2c8b1]">
                Active members and alumni
            </h2>
        </div>
        <div className="flex h-full w-1/3 flex-col justify-center border border-[#f0cf86]/12 text-center">
            <h1>
                60+
            </h1>
            <h2 className="text-base text-[#e2c8b1]">
                Companies represented
            </h2>
        </div>
        <div className="flex h-full w-1/3 flex-col justify-center border border-[#f0cf86]/12 text-center">
            <h1>
                12
            </h1>
            <h2 className="text-base text-[#e2c8b1]">
                Graduate programs
            </h2>
        </div>

      </section>
      <section className="bg-[#300811] px-62 flex flex-col h-[110vh] gap-4 items-start justify-center">
        <h1 className="text-lg font-serif text-[#f0cf86]">
            ALUMNI NETWORK
        </h1>
        <h1 className="text-4xl font-serif font-white text-[#fff8ee]">
            Our brothers have go on to -
        </h1>
        <h1 className="text-lg text-[#e2c8b1] font-serif">
            From leading companies to top PhD programs, Theta Tau members are everywhere!
        </h1>
        <div className="flex flex-row gap-6 pt-3 font-serif text-[#fff8ee]">
            <button
                type="button"
                onClick={() => setCategory("companies")}
                className={`px-12 h-10 min-w-50 cursor-pointer border transition rounded-lg ${
                  category === "companies" ? "bg-[#571120] border-[#f0cf86]/45" : "border-[#f0cf86]/22 bg-white/6 hover:bg-[#571120]"
                }`}
            >
                <h1>Companies</h1>
            </button>
            <button
                type="button"
                onClick={() => setCategory("schools")}
                className={`px-12 h-10 min-w-50 cursor-pointer border transition rounded-lg ${
                  category === "schools" ? "bg-[#571120] border-[#f0cf86]/45" : "border-[#f0cf86]/22 bg-white/6 hover:bg-[#571120]"
                }`}
            >
                <h1>Graduate Schools</h1>
            </button>
            

        </div>
        <div className="grid w-full max-w-5xl grid-cols-4 justify-items-center gap-6 self-center pt-5">
          {displayedItems.map((item) => (
            <Card
              key={item.name}
              name={item.name}
              number={item.number}
              initials={item.initials}
              label={item.label}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
