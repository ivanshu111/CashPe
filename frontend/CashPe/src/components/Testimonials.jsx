import React from "react";

const testimonials = [
  {
    quote:
      "CashPe has completely changed the way I manage my finances. It's so simple and intuitive. I finally feel in control of my money!",
    author: "Jane D., Freelance Designer",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    quote:
      "Sending money to my family has never been easier. The instant transfers are a lifesaver. Highly recommended!",
    author: "Mark S., Student",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    quote:
      "I love the expense tracking feature. It helps me see exactly where my money goes, so I can budget better. It's a must-have app.",
    author: "Sarah L., Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-base-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            What Our Users Are Saying
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-base-content sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="rounded-2xl bg-base-200 p-8 shadow-lg ring-1 ring-gray-900/5"
            >
              <blockquote className="text-base-content">
                <p>{`“${testimonial.quote}”`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <img
                  className="h-10 w-10 rounded-full bg-gray-50"
                  src={testimonial.avatar}
                  alt=""
                />
                <div>
                  <div className="font-semibold text-base-content">
                    {testimonial.author}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
