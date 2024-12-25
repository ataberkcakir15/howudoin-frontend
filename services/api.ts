import axios from "axios";

const api = axios.create({
  baseURL: "{buraya kendi IP'ni yaz}:8080/api",
});

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    const response = await api.post("/register", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || "An error occurred";
    throw new Error(errorMessage);
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response || error.message);
    const errorMessage = error.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
}

export async function sendFriendRequest(toEmail: string, token: string) {
  const url = `/friends/add?toEmail=${encodeURIComponent(toEmail)}`;

  const response = await api.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function acceptFriendRequest(fromEmail: string, token: string) {
  const url = `/friends/accept?fromEmail=${encodeURIComponent(fromEmail)}`;

  const response = await api.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function rejectFriendRequest(fromEmail: string, token: string) {
  const url = `/friends/reject?fromEmail=${encodeURIComponent(fromEmail)}`;

  const response = await api.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getPendingRequests(token: string) {
  const response = await api.get(`/friends/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getFriends(token: string) {
  const response = await api.get(`/friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function sendMessage(
  token: string,
  toEmail: string,
  content: string
) {
  const response = await api.post(
    "/messages/send",
    { toEmail, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getMessages(token: string, otherUserEmail: string) {
  const response = await api.get(
    `/messages?otherUserEmail=${encodeURIComponent(otherUserEmail)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getGroups(token: string) {
  const response = await api.get("/groups", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createGroup(
  token: string,
  groupName: string,
  memberEmails: string[]
) {
  const payLoad = {
    name: groupName,
    memberEmails: memberEmails,
  };
  try {
    const response = await api.post("/groups/create", payLoad, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error creating group");
  }
}

export async function getGroupMessages(token: string, groupId: string) {
  const response = await api.get(`/groups/${groupId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function sendGroupMessage(
  token: string,
  groupId: string,
  content: string
) {
  const url = `/groups/${groupId}/send?content=${encodeURIComponent(content)}`;
  const response = await api.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export const getGroupMembers = async (
  token: string,
  groupId: string
): Promise<string[]> => {
  const response = await fetch(
    `http://192.168.1.85:8080/api/groups/${groupId}/members`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch group members");
  }

  return await response.json();
};

export async function addMemberToGroup(
  token: string,
  groupId: string,
  newMemberEmail: string
) {
  const response = await api.post(
    `/groups/${groupId}/add-member?newMemberEmail=${encodeURIComponent(
      newMemberEmail
    )}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export default api;
