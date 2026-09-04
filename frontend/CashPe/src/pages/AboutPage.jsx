import React from "react";

const team = [
  {
    name: "Ivanshu Pratap Singh",
    role: "Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-base-100">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                  <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl">
                    Empowering your financial journey.
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-base-content sm:max-w-md lg:max-w-none">
                    At CashPe, we believe in making financial management
                    accessible, simple, and secure for everyone. Our mission is
                    to empower individuals and businesses with innovative tools
                    to manage their money with confidence.
                  </p>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-photo/diverse-business-people-meeting_53876-24953.jpg?w=740&t=st=1708689498~exp=1708690098~hmac=8c4f74a81335b433405b81f37e40b3c675c233c72b2d075d9d20c585c2c7b5d8"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-photo/group-business-people-working-board-room_53876-25032.jpg?w=740&t=st=1708689524~exp=1708690124~hmac=a50c82245b9a89668582d02a0a256b19a3b61a7a001b9e3a6c2f4a4d6f04c637"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-photo/group-business-people-having-meeting-board-room_53876-25030.jpg?w=740&t=st=1708689549~exp=1708690149~hmac=c4b4a6b2c4e2a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-photo/group-business-people-working-board-room_53876-25031.jpg?w=740&t=st=1708689574~exp=1708690174~hmac=0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src="https://img.freepik.com/free-photo/group-business-people-working-board-room_53876-25029.jpg?w=740&t=st=1708689599~exp=1708690199~hmac=0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a0a2a"
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Our team
            </h2>
            <p className="mt-6 text-lg leading-8 text-base-content">
              Meet the dedicated individuals behind CashPe, united by a passion
              for innovation and a commitment to transforming financial
              experiences.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-1"
          >
            {team.map((person) => (
              <li key={person.name}>
                <img
                  className="aspect-[14/13] w-full rounded-2xl object-cover"
                  src={person.imageUrl}
                  alt=""
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-base-content">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-base-content">
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};
export default AboutPage;
