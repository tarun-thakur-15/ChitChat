// Services/schema.ts

// ===== SIGNUP =====
export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  otpExpiresInMinutes: number;
}

// ===== LOGIN =====
export interface LoginRequest {
  identifier: string; // username or email
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
}

// ===== FORGOT PASSWORD =====
export interface ForgotPasswordRequest {
  identifier: string; // username or email
}

export interface ForgotPasswordResponse {
  message: string;
  otpExpiresInMinutes: number;
  username: string;
  email: string;
}

// ===== VERIFY OTP =====
export interface VerifyOtpRequest {
  identifier: string; // username or email
  code: string;
  purpose: "signup" | "password_reset";
}

export interface VerifyOtpResponse {
  message: string;
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  accessToken?: string;
}

// ===== RESET PASSWORD =====
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ===== LOGOUT =====
export interface LogoutResponse {
  message: string;
}
export interface MyProfileResponse {
  fullName: string;
  username: string;
  profileImage: string | null;
  coverImage: string | null;
  bio: string | null;
  joinedOn: string;
  totalFriends: number;
}
// ===== UODATE BIO =====
export interface UpdateBioResponse {
  success: boolean;
  bio: string;
}
// ===== UPLOAD COVER IMAGE =====
export interface UploadCoverImageResponse {
  message?: any;
  success: boolean;
  coverImage: string;
}

// ===== UPLOAD PROFILE IMAGE =====
export interface UploadProfileImageResponse {
  success: boolean;
  profileImage: string; // backend returns profileImage URL
  message?: string; // in case of error
}

export interface MeResponse {
  user: {
    id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
}

export interface SuggestedUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  joinedOn: string;
  profileImage: string;
  friendsCount: number;
  isFriend: boolean;
  hasSentRequest: boolean;
}

export interface GetSuggestedUsersResponse {
  success: boolean;
  suggested: SuggestedUser[]; // can be more than one user
}

export interface SearchUser {
  _id: string;
  fullName: string;
  username: string;
  email?: string;
  profileImage?: string;
  joinedOn: string;
  friendsCount: number;
  isFriend: boolean;
  hasSentRequest?: boolean;
}

export interface SearchUsersResponse {
  success: boolean;
  results: SearchUser[];
}

export interface FriendRequest {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

export interface GetFriendRequestsResponse {
  success: boolean;
  requests: FriendRequest[];
}

export interface FriendRequest {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

export interface AcceptFriendRequestResponse {
  success: boolean;
  message: string;
}

export interface DeleteFriendRequestResponse {
  success: boolean;
  message: string;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  joinedOn: string; // formatted date
  totalFriends: number;
  isFriend: boolean;
}

export interface UserFriend {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage?: string;
  joinedOn: string;
  friendsCount: number;
}

export interface SearchFriendsResponse {
  success: boolean;
  results: UserFriend[];
}

export interface RemoveFriendResponse {
  data?: any;
  success: boolean;
  message: string;
}

export interface ChangeFullNameResponse {
  data?: any;
  success: boolean;
  message: string;
  fullName?: string;
}

export interface ChangeUserNameResponse {
  data?: any;
  success: boolean;
  message: string;
  username?: string;
}

export interface UserMini {
  _id: string;
  username: string;
  fullName: string;
  profileImage?: string;
}

export interface MessageMini {
  _id: string;
  message: string;
  mediaUrl?: string;
  sender: UserMini;
  status: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: UserMini[];
  latestMessage?: MessageMini;
  updatedAt: string;
}

export interface GetConversationsResponse {
  success: boolean;
  conversations: Conversation[];
  friendsWithoutConversation: UserMini[];
}

export interface Message {
  receiver: any;
  status: "sent" | "delivered" | "read";
  message: string;
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
  content: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface ApiMessage {
  _id: string;
  message: string;
  mediaUrl?: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;

  sender: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };

  receiver: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  fileName?: string;
}

export interface GetMessagesResponse {
  success: boolean;
  messages: Message[];
}

export interface StartConversationRequest {
  receiverId: string;
}

export interface StartConversationResponse {
  success: boolean;
  conversation: {
    _id: string;
    participants: Array<{
      _id: string;
      fullName: string;
      username: string;
      profileImage?: string;
    }>;
  };
  message?: string;
}

export interface SendMessageRequest {
  receiverId: string;
  message: string;
  mediaUrl?: string; // optional for file uploads
}

export interface ChatMessageResponse {
  _id: string;
  conversation: string;
  sender: string | UserMini;   // ⬅ allow string
  receiver: string | UserMini; // ⬅ allow string
  message: string;
  mediaUrl?: string;
  status: "sent" | "delivered" | "read";
  seenAt?: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
