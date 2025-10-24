const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  accessToken: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "Failed to change password",
    };
  }
}
