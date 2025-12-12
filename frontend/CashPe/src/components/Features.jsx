import React from "react";
import {
  ShieldCheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Smart Savings",
    description:
      "Automatically set aside money for your goals. Whether it's a vacation or a new car, we'll help you get there.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Instant Transfers",
    description:
      "Send and receive money from friends and family in seconds. No more waiting.",
    icon: BoltIcon,
  },
  {
    name: "Expense Tracking",
    description:
      "See where your money is going with our easy-to-read charts and categorizations.",
    icon: ChartBarIcon,
  },
  {
    name: "Secure Payments",
    description:
      "Your security is our priority. All your transactions are protected with bank-level encryption.",
    icon: ShieldCheckIcon,
  },
];

const Features = () => {
  return (
    <div className="bg-base-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Manage your money with CashPe
          </p>
          <p className="mt-6 text-lg leading-8 text-base-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-base-content">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-base-content">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
