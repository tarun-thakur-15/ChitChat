"use client";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import { Plus, Check, X, Pencil } from "lucide-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import DefaultCoverImage from "../app/images/defaultCoverPicture.png";
import DefaultProfileImage from "../app/images/business-man.png";
import { useCallback, useRef, useState } from "react";
import {
  uploadCoverImage,
  uploadProfileImage,
  changeFullNameApi,
  changeUserNameApi
} from "@/app/services/api";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { MyProfileResponse } from "@/app/services/schema";
import { toast } from "sonner";
type MyProfilePreview = Pick<
  MyProfileResponse,
  "fullName" | "username" | "coverImage" | "profileImage"
>;

export default function MyProfile({
  fullName,
  username,
  coverImage,
  profileImage,
}: MyProfilePreview) {
  const [requestSent, setRequestSent] = useState(false);

  //   ----------profile picture---------
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [newProfileImage, setProfileImage] = useState<string | null>(null); // actual uploaded image

  const handleIconClick = () => {
    fileInputRef.current?.click(); // open file selector
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // show preview immediately
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setProfilePic(base64);

        try {
          const res = await uploadProfileImage(base64);
          if (res.success) {
            setProfileImage(res.profileImage);
            toast.success("Profile image updated!");
            window.location.reload();
          } else {
            toast.error(res.message || "Failed to update profile image");
          }
        } catch (err) {
          console.error("❌ Error uploading profile image:", err);
          toast.error("Something went wrong while uploading");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  //   ---------------Cover Picture---------------------
  const fileInputRefCoverPicture = useRef<HTMLInputElement | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | StaticImport>(
    coverImage || DefaultCoverImage
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleIconClickCoverPicture = () => {
    fileInputRefCoverPicture.current?.click();
  };

  const handleFileChangeCoverPicture = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropCompleteCoverPicture = useCallback((_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  //this below function is to compress the base64 cover image
  function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert cropped area to a final image & send to API
  const getCroppedImageCoverPicture = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64 = canvas.toDataURL("image/jpeg");

    setShowCropper(false);

    try {
      //reducing the file size via browser-image-compression
      const compressedFile = await imageCompression(
        base64ToFile(base64, "cover.jpg"),
        {
          maxSizeMB: 3,
          useWebWorker: true,
          initialQuality: 0.7,
        }
      );
      const compressedBase64 = await fileToBase64(compressedFile);

      const res = await uploadCoverImage(compressedBase64);

      if (res.success) {
        setCoverPhoto(res.coverImage); // ✅ only update if success
        toast.success("Cover image updated successfully!");
      } else {
        toast.error(res.message || "Failed to update cover image");
      }
    } catch (error: any) {
      console.error("❌ Error uploading cover image:", error);

      let backendMessage = "Failed to update cover image";

      if (error.response) {
        if (typeof error.response.data === "string") {
          // ✅ Extract text inside <pre>...</pre> from raw HTML
          const match = error.response.data.match(/<pre>(.*?)<\/pre>/);
          backendMessage = match ? match[1] : error.response.data;
        } else if (error.response.data?.message) {
          backendMessage = error.response.data.message;
        }
      }

      toast.error(backendMessage);
    }
  };

  // Utility to load image
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img: HTMLImageElement = new window.Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (ev: Event | string) => reject(ev);
    });
  // ---------------for changing full name-------------------
  const [isFullNameEditing, setIsFullNameEditing] = useState(false);
  const [userFullName, setUserFullName] = useState(fullName);
  const [tempFullName, setTempFullName] = useState(fullName);
  const [loading, setLoading] = useState(false);

  const handleFullNameSave = async () => {
    if (tempFullName.trim() === "") {
      toast.error("Full name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await changeFullNameApi(tempFullName.trim());
      if (res.success) {
        setUserFullName(res.fullName || tempFullName.trim());
        setIsFullNameEditing(false);
        toast.success(res.message || res.data.message || "Name changed");
      } else {
        toast.error(res?.data?.message || res?.message || "Failed to update name");
      }
    } catch (err: any) {
      console.error("❌ Error changing full name:", err);
      toast.error(err.message || "Failed to update full name");
    } finally {
      setLoading(false);
    }
  };

  const handleFullNameCancel = () => {
    setTempFullName(userFullName);
    setIsFullNameEditing(false);
  };

  // ---------------for changing username-------------------
  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const [userName, setUserName] = useState(username);
  const [tempUserName, setTempUserName] = useState(username);
  const [loadingUserName, setLoadingUserName] = useState(false);

  const handleUserNameSave = async () => {
    if (tempUserName.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }

    setLoadingUserName(true);
    try {
      const res = await changeUserNameApi(tempUserName.trim());
      if (res.success) {
        setUserName(res.username || tempUserName.trim());
        setIsUserNameEditing(false);
        toast.success(res.data?.message || res.message || "Username changed");
      } else {
        toast.error(res.message || "Failed to update username");
      }
    } catch (err: any) {
      console.error("❌ Error changing username:", err);
      toast.error(err.message || "Failed to update username");
    } finally {
      setLoadingUserName(false);
    }
  };

  const handleUserNameCancel = () => {
    setTempUserName(userName);
    setIsUserNameEditing(false);
  };
  return (
    <>
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
      >
        {/* Cover Area */}
        <div>
          {/* Cover Photo Preview */}

          <div className="relative rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
            <Image
              width={861}
              height={216}
              src={coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover rounded-xl"
            />

            <Plus
              onClick={handleIconClickCoverPicture}
              className="absolute cursor-pointer bottom-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full border-4 border-white dark:border-gray-800 shadow hover:scale-105 transition-transform z-10"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRefCoverPicture}
              onChange={handleFileChangeCoverPicture}
              className="hidden"
            />

            {/* You can conditionally render your cropper modal here when showCropper = true */}
          </div>

          {/* Cropping Modal */}
          {showCropper && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative w-[90%] h-[70%] flex flex-col">
                <Cropper
                  image={imageSrc!}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteCoverPicture}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded-md z-10"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={getCroppedImageCoverPicture}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md z-10"
                  >
                    <Check size={16} /> Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                <Image
                  height={40}
                  width={40}
                  src={newProfileImage || profileImage || DefaultProfileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <Plus
                onClick={handleIconClick}
                className="cursor-pointer absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"
              />

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 mt-4 md:mt-[55px]">
              {/* Full Name */}
              <div className="flex items-center gap-2">
                {isFullNameEditing ? (
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="text"
                      value={tempFullName}
                      onChange={(e) => setTempFullName(e.target.value)}
                      className="px-2 py-1 text-lg font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleFullNameSave}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={handleFullNameCancel}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-0 mt-0">
                      {userFullName}
                    </h1>
                    <button
                      onClick={() => setIsFullNameEditing(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                )}
              </div>
              {/* User Name */}
              <div className="flex items-center gap-2">
                {isUserNameEditing ? (
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="text"
                      value={tempUserName}
                      onChange={(e) => setTempUserName(e.target.value)}
                      className="px-2 py-1 text-lg font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleUserNameSave}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={handleUserNameCancel}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      {userName}
                    </p>
                    <button
                      onClick={() => setIsUserNameEditing(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
