"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebaseConfig";
import { useUser } from "@clerk/nextjs";

import ImageSelection from "./_components/ImageSelection";
import RoomType from "./_components/RoomType";
import DesignType from "./_components/DesignType";
import AdditionalReq from "./_components/AdditionalReq";
import CustomLoading from "./_components/CustomLoading";
import AiOutputDialog from "./_components/AiOutputDialog";
import { UserDetailContext } from "../../_context/UserDetailContext";

function CreateNew() {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [orgImage, setOrgImage] = useState();

  const onHandleInputChange = (value, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const saveRawImageToFirebase = async () => {
    const fileName = `${Date.now()}_raw.png`;
    const imageRef = ref(storage, `interior-ai/${fileName}`);

    await uploadBytes(imageRef, formData.image);
    console.log("File Uploaded...");

    const downloadUrl = await getDownloadURL(imageRef);
    console.log("downloadUrl:", downloadUrl);

    return downloadUrl;
  };

  const updateUserCredits = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      alert("로그인 정보가 없습니다.");
      return false;
    }

    if (!userDetail) {
      alert("사용자 정보를 불러오지 못했습니다.");
      return false;
    }

    const currentCredits = Number(userDetail.credits || 0);

    if (currentCredits <= 0) {
      alert("크레딧이 부족합니다.");
      return false;
    }

    const result = await axios.post("/api/update-credits", {
      email: userEmail,
      credits: currentCredits - 1,
    });

    if (result.data.success) {
      setUserDetail((prev) => ({
        ...prev,
        credits: currentCredits - 1,
      }));

      return true;
    }

    return false;
  };

  const generateAIImage = async () => {
    try {
      if (!formData.image) {
        alert("이미지를 선택해주세요.");
        return;
      }

      if (!formData.roomType) {
        alert("방 타입을 선택해주세요.");
        return;
      }

      if (!formData.designType) {
        alert("디자인 타입을 선택해주세요.");
        return;
      }

      if (!user?.primaryEmailAddress?.emailAddress) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!userDetail || Number(userDetail.credits || 0) <= 0) {
        alert("크레딧이 부족합니다.");
        return;
      }

      setLoading(true);

      const rawImageUrl = await saveRawImageToFirebase();
      setOrgImage(rawImageUrl);

      const result = await axios.post("/api/interior-ai", {
        imageUrl: rawImageUrl,
        roomType: formData.roomType,
        designType: formData.designType,
        additionalReq: formData.additionalReqInput,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });

      setAiOutputImage(result.data.result);

      await updateUserCredits();

      setOpenOutputDialog(true);

      console.log("result", result);
      console.log("AI image URL:", result.data.result);
    } catch (error) {
      console.log("Error generating AI image:", error);
      alert("AI 이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2
        style={{
          color: "purple",
          fontWeight: "bold",
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Create AI Interior
      </h2>

      {loading ? (
        <CustomLoading />
      ) : (
        <div className="grid grid-cols-2 gap-8 p-6">
          <div>
            <ImageSelection
              selectedFile={(value) => onHandleInputChange(value, "image")}
            />
          </div>

          <div>
            <RoomType
              selectedRoomType={(value) =>
                onHandleInputChange(value, "roomType")
              }
            />

            <DesignType
              selectedDesignType={(value) =>
                onHandleInputChange(value, "designType")
              }
            />

            <AdditionalReq
              additionalReqInput={(value) =>
                onHandleInputChange(value, "additionalReqInput")
              }
            />

            <button
              className="btn btn-primary w-full mt-5"
              onClick={generateAIImage}
            >
              Generate
            </button>

            <p className="text-gray-500 mt-2">
              Each generation costs one credit
            </p>
          </div>
        </div>
      )}

      <AiOutputDialog
        openDialog={openOutputDialog}
        setOpenDialog={setOpenOutputDialog}
        orgImage={orgImage}
        aiImage={aiOutputImage}
      />
    </div>
  );
}

export default CreateNew;