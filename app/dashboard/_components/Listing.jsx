"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import RoomDesignCard from "./RoomDesignCard";
import AiOutputDialog from "../create-new/_components/AiOutputDialog";

function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState();

  useEffect(() => {
    if (user) {
      GetUserRoomList();
    }
  }, [user]);

  const GetUserRoomList = async () => {
    try {
      const result = await axios.post("/api/get-user-room-list", {
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });

      setUserRoomList(result.data.result);
      console.log(result.data.result);
    } catch (error) {
      console.log("Error fetching user room list:", error);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-3xl">Hello, {user?.fullName}</h2>
          <p className="text-gray-500">
            Create new AI interior designs and view your generated rooms
          </p>
        </div>

        <Link href="/dashboard/create-new">
          <button className="btn btn-primary">+ Generate AI Interior</button>
        </Link>
      </div>

      <div className="mt-10">
        {userRoomList?.length === 0 ? (
          <div className="flex justify-center items-center h-full text-2xl text-gray-500 mt-3">
            No Interior AI Designs Generated Yet
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {userRoomList.map((room, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedRoom(room);
                  setOpenDialog(true);
                }}
              >
                <RoomDesignCard room={room} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AiOutputDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        aiImage={selectedRoom?.aiImage}
        orgImage={selectedRoom?.orgImage}
      />
    </div>
  );
}

export default Listing;