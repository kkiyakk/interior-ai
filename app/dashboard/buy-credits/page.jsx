"use client";

import React, { useContext, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserDetailContext } from "../../_context/UserDetailContext";

function BuyCredits() {
  const [selectedOption, setSelectedOption] = useState(null);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const creditsOption = [
    {
      credits: 5,
      amount: 0.99,
    },
    {
      credits: 10,
      amount: 1.99,
    },
    {
      credits: 25,
      amount: 3.99,
    },
    {
      credits: 50,
      amount: 6.99,
    },
    {
      credits: 100,
      amount: 9.99,
    },
  ];

  const onPaymentSuccess = async () => {
    console.log("payment success...");

    const updatedCredits =
      Number(userDetail?.credits || 0) + Number(selectedOption?.credits || 0);

    const result = await axios.post("/api/update-credits", {
      email: userDetail?.email,
      credits: updatedCredits,
    });

    if (result.data.success) {
      setUserDetail((prev) => ({
        ...prev,
        credits: updatedCredits,
      }));

      router.push("/dashboard");
    }
  };

  return (
    <div className="p-10">
      <div className="text-xl font-bold text-center mb-6">
        Buy More Credits
      </div>

      <div className="flex flex-row gap-4 justify-center flex-wrap">
        {creditsOption.map((item, index) => (
          <div
            key={index}
            className={`card bg-base-100 w-48 shadow-xl ${
              selectedOption?.credits === item.credits
                ? "border-2 border-primary"
                : ""
            }`}
          >
            <div className="card-body p-4 items-center">
              <h2 className="card-title">{item.credits} Credits</h2>

              <p>for ${item.amount}</p>

              <button
                className="btn btn-primary"
                onClick={() => setSelectedOption(item)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-4 px-4">
        {selectedOption?.amount && (
          <PayPalButtons
            style={{
              layout: "horizontal",
              width: "100%",
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption?.amount?.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              await actions.order.capture();
              await onPaymentSuccess();
            }}
            onCancel={() => {
              console.log("Payment Cancelled");
            }}
            onError={(err) => {
              console.log("PayPal Error", err);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default BuyCredits;