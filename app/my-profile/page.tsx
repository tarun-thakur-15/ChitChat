"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import {
  MessageCircle,
  UserPlus,
  Calendar,
  Users,
  Clock,
  Plus,
  Check,
  X,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Tarun from "../images/Taruncropped.webp";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import MyFriendsModal from "@/components/myFriendsModal";

export default function ProfilePage() {
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit..."
  );
  const [tempText, setTempText] = useState(aboutText);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);

  //   ----------profile picture---------
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click(); // open file selector
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result as string); // preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setAboutText(tempText);
    setIsEditing(false);
    // 🔗 Call API here to update backend
  };

  const handleCancel = () => {
    setTempText(aboutText); // reset changes
    setIsEditing(false);
  };

  const handleSendRequest = () => {
    setRequestSent(true);
  };

  //   ---------------Cover Picture---------------------
  const fileInputRefCoverPicture = useRef<HTMLInputElement | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | StaticImport>("");
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

  // Convert cropped area to a final image
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
    setCoverPhoto(base64);
    setShowCropper(false);
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
  const [fullName, setFullName] = useState("Tarun Thakur");
  const [tempFullName, setTempFullName] = useState(fullName);

  const handleFullNameSave = () => {
    setFullName(tempFullName);
    setIsFullNameEditing(false);
  };

  const handleFullNameCancel = () => {
    setTempFullName(fullName);
    setIsFullNameEditing(false);
  };

  // ---------------for changing username-------------------
  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const [userName, setUserName] = useState("tarun_hun_yar");
  const [tempUserName, setTempUserName] = useState(userName);

  const handleUserNameSave = () => {
    setUserName(tempUserName);
    setIsUserNameEditing(false);
  };

  const handleUserNameCancel = () => {
    setTempUserName(userName);
    setIsUserNameEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}

      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
        >
          {/* Cover Area */}
          <div>
            {/* Cover Photo Preview */}
            {coverPhoto ? (
              <div className="relative rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
                <Image
                  width={861}
                  height={216}
                  src={coverPhoto}
                  alt="Cover"
                  className="w-full h-full"
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
              </div>
            ) : (
              <div className="h-[216px] relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md">
                <Image
                  width={861}
                  height={216}
                  src={Tarun}
                  alt="default-cover-photo"
                  className="w-full h-full object-cover object-top"
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
              </div>
            )}

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
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-4xl">👤</span> // fallback avatar
                  )}
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
                        {fullName}
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
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        @tarun_hun_yar
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

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isFriend ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Start Chat</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendRequest}
                      disabled={requestSent}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-colors ${
                        requestSent
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>
                        {requestSent ? "Request Sent" : "Send Request"}
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div
              onClick={() => setFriendsModalOpen(true)}
              role="button"
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  15
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Friends
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  Online
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Status
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Jan 2023
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Joined
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              About
            </h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-3 text-gray-600 dark:text-gray-400 break-words">
            {!isEditing ? (
              <p>{aboutText}</p>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={4}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        <MyFriendsModal
          open={friendsModalOpen}
          onOpenChange={setFriendsModalOpen}
        />
      </div>
    </div>
  );
}
