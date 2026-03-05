"use client";
import React from "react";

export default function HowItWorks() {
    const steps = [
        {
            title: "Enter Product Price",
            description:
                "Provide the base price of the product you want to calculate."
        },
        {
            title: "Add Quantity",
            description:
                "Mention how many units you are purchasing."
        },
        {
            title: "Include Shipping & Discount",
            description:
                "Add shipping charges and subtract any applicable discounts."
        },
        {
            title: "Get Final Price",
            description:
                "Click calculate to instantly see the final payable amount."
        }
    ];

    return (
        <section className="bg-(--background) py-20 px-4">

            <div className="max-w-6xl mx-auto">

                {/* Section Heading */}
                <h2 className="heading text-(--foreground) text-center mb-14">
                    How It Works ?
                </h2>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="
                text-center
                p-6
                rounded-2xl
                bg-(--card)
                border border-(--border)
                shadow-sm
                hover:shadow-md
                transition-all
              "
                        >
                            {/* Step Number */}
                            <div
                                className="
                  w-12 h-12
                  mx-auto mb-5
                  flex items-center justify-center
                  rounded-full
                  bg-(--primary)
                  text-(--primary-foreground)
                  font-bold text-lg
                "
                            >
                                {index + 1}
                            </div>

                            {/* Title */}
                            <h3 className="subheading mb-3">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="description text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
