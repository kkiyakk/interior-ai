"use client";

import React from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

function RoomDesignCard({ room }) {
  return (
    <div className="shadow-md rounded-lg cursor-pointer hover:scale-105 transition-all overflow-hidden">
      <ReactBeforeSliderComponent
        firstImage={{
          imageUrl: room.aiImage,
        }}
        secondImage={{
          imageUrl: room.orgImage,
        }}
      />

      <div className="p-3">
        <p className="font-bold text-sm">
          🏠 Room Type: {room.roomType}
        </p>

        <p className="font-bold text-sm">
          🎨 Design Type: {room.designType}
        </p>
      </div>
    </div>
  );
}

export default RoomDesignCard;