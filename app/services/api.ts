// Services/api.ts
import axios from "axios";
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutResponse,
  UpdateBioResponse,
  UploadCoverImageResponse,
  UploadProfileImageResponse,
  SearchUsersResponse,
  AcceptFriendRequestResponse,
  DeleteFriendRequestResponse,
  SearchFriendsResponse,
  RemoveFriendResponse,
  ChangeFullNameResponse,
  ChangeUserNameResponse,
  GetConversationsResponse,
  GetMessagesResponse,
  StartConversationRequest,
  StartConversationResponse,
  ChatMessageResponse,
  SendMessageRequest,
  GetLastFriendRequestsResponse,
  SendFriendRequestResponse,
  UnsendMessageResponse,
} from "./schema";
// const base_url = "https://chat-shat-backend.onrender.com/api";
const base_url = "/api";

// Create axios instance (optional, you can add baseURL & headers)
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ===== SIGNUP =====
export const signupApi = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(`${base_url}/signup`, data);
  return response.data;
};

// ===== LOGIN =====
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", data);
  return response.data;
};

// ===== FORGOT PASSWORD =====
export const forgotPasswordApi = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/forgot-password",
    data
  );
  return response.data;
};

// ===== VERIFY OTP =====
export const verifyOtpApi = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await api.post<VerifyOtpResponse>("/verify-otp", data);
  return response.data;
};

// ===== RESET PASSWORD =====
export const resetPasswordApi = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    "/reset-password",
    data
  );
  return response.data;
};

// ===== LOGOUT =====
export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/logout");
  return response.data;
};

// ===== UODATE BIO =====
export const updateBioApi = async (bio: string): Promise<UpdateBioResponse> => {
  const res = await axios.post(
    `${base_url}/bio`,
    { bio },
    { withCredentials: true } // 🔑 needed since auth token is in cookies
  );
  return res.data;
};

// ===== UPLOAD COVER IMAGE =====
export const uploadCoverImage = async (
  filePath: string
): Promise<UploadCoverImageResponse> => {
  const res = await fetch(`${base_url}/cover-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies (accessToken)
    body: JSON.stringify({ filePath }),
  });

  if (!res.ok) {
    throw new Error("Failed to upload cover image");
  }

  return res.json();
};

// ===== UPLOAD PROFILE IMAGE =====
export const uploadProfileImage = async (
  filePath: string
): Promise<UploadProfileImageResponse> => {
  const response = await axios.post<UploadProfileImageResponse>(
    `${base_url}/profile-image`,
    { filePath },
    { withCredentials: true } // send cookies (auth token)
  );
  return response.data;
};

export async function searchUsersApi(
  query: string,
  token: string
): Promise<SearchUsersResponse> {
  const res = await fetch(
    `${base_url}/searchUser?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Remove Authorization header
      },
      cache: "no-store",
      credentials: "include", // Include cookies in request
      // Set cookie manually if needed
      // Note: For server-side cookies, the token should already be in the browser cookie
    }
  );

  if (!res.ok) {
    throw new Error("Failed to search users");
  }

  return res.json();
}

export async function acceptFriendRequestApi(
  userId: string
): Promise<AcceptFriendRequestResponse> {
  const res = await fetch(`${base_url}/acceptFriendRequest/${userId}`, {
    method: "POST",
    credentials: "include", // 🔑 browser will attach HttpOnly cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to accept friend request");
  }

  return res.json();
}

export async function deleteFriendRequestApi(
  userId: string
): Promise<DeleteFriendRequestResponse> {
  const res = await fetch(`${base_url}/deleteRequest`, {
    method: "DELETE",
    credentials: "include", // 🔑 browser will attach HttpOnly cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete friend request");
  }

  return res.json();
}

export async function searchFriendsApi(
  username: string
): Promise<SearchFriendsResponse> {
  const res = await fetch(`${base_url}/searchFriends?username=${username}`, {
    method: "GET",
    credentials: "include", // include cookies (accessToken)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch friends");
  }

  return res.json();
}

export async function removeFriendApi(
  userId: string
): Promise<RemoveFriendResponse> {
  const res = await fetch(`${base_url}/remove-friend/${userId}`, {
    method: "DELETE",
    credentials: "include", // ensures cookies are sent
  });

  if (!res.ok) {
    throw new Error("❌ Failed to remove friend");
  }

  return res.json();
}

export async function changeFullNameApi(
  fullName: string
): Promise<ChangeFullNameResponse> {
  const res = await fetch(`${base_url}/changeFullName`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies
    body: JSON.stringify({ fullName }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to change full name");
  }

  return res.json();
}

export async function changeUserNameApi(
  username: string
): Promise<ChangeUserNameResponse> {
  const res = await fetch(`${base_url}/changeUserName`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to change username");
  }

  return res.json();
}

export async function getConversationsApi(): Promise<GetConversationsResponse> {
  try {
    const res = await fetch(`${base_url}/getConversations`, {
      method: "GET",
      credentials: "include", // browser sends cookies automatically
      cache: "no-store", // no stale data
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "❌ Failed to fetch conversations");
    }

    return res.json();
  } catch (err: any) {
    throw new Error(
      err.message || "Network error while fetching conversations"
    );
  }
}

export async function getMessagesApi(
  conversationId: string,
  limit: number = 10,
  before?: string
): Promise<GetMessagesResponse> {
  try {
    console.log("getMessagesApi called");
    console.log("conversationId is:", conversationId);

    let url = `${base_url}/messages/${conversationId}?limit=${limit}`;
    if (before) url += `&before=${before}`;

    console.log("🟢 Final URL:", url);

    const res = await fetch(url, {
      method: "GET",
      credentials: "include", // ✅ Send cookies with request
      cache: "no-store", // ✅ Avoid cached data
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "❌ Failed to fetch messages");
    }

    return res.json();
  } catch (err: any) {
    throw new Error(err.message || "Network error while fetching messages");
  }
}

export async function startConversationApi(
  data: StartConversationRequest
): Promise<StartConversationResponse> {
  try {
    const res = await fetch(`${base_url}/startConversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Send cookies automatically
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "❌ Failed to start conversation");
    }

    return res.json();
  } catch (err: any) {
    throw new Error(err.message || "Network error while starting conversation");
  }
}

export const sendMessageApi = async (
  payload: SendMessageRequest | FormData
): Promise<{ success: boolean; chat: ChatMessageResponse }> => {
  const isFormData = payload instanceof FormData;

  const res = await axios.post(`${base_url}/sendMessage`, payload, {
    withCredentials: true,
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

  return res.data;
};

export const getLastFriendRequestsApi =
  async (): Promise<GetLastFriendRequestsResponse> => {
    const res = await axios.get(`${base_url}/getLastThreeFriendRequests`, {
      withCredentials: true,
    });
    return res.data;
  };

export const sendFriendRequestApi = async (
  userId: string
): Promise<SendFriendRequestResponse> => {
  const res = await axios.post(
    `${base_url}/sendFriendRequest/${userId}`,
    null,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export async function unsendMessageApi(
  messageId: string
): Promise<UnsendMessageResponse> {
  try {
    const response = await axios.post(
      `${base_url}/message/unsend`,
      { messageId },
      {
        withCredentials: true, // if auth uses cookies
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Unsend message error:",
      error.response?.data || error.message
    );
    throw error;
  }
}
