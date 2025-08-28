"use client";

import { toastError } from "@/components/toasts";
import { useUserStore } from "@/context/stores/user.store";
import { UserDTO } from "@/dto/user.dto";
import { isTokenExpired } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  user: UserDTO;
};

interface LoginErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: string;
}

// Função que chama o endpoint
async function loginUser(data: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errorResponse = (await res.json()) as unknown as LoginErrorResponse;
    throw new Error(errorResponse.message || "Erro ao fazer login");
  }

  return res.json();
}

// Hook
export function useLogin() {
  const setUser = useUserStore((state) => state.setUser);
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      sessionStorage.setItem("access_token", data.access_token);
      setUser(data.user);
    },
    onError: (err) => {
      toastError({
        header: "Erro!",
        description: `${err.message}`,
      });
    },
  });
}

export async function refreshToken(): Promise<{ access_token: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Não foi possível renovar o token");
  }

  return await res.json();
}

export async function getAccessToken(): Promise<string | null> {
  let token = sessionStorage.getItem("access_token");

  if (!token || (await isTokenExpired(token))) {
    // tenta renovar
    try {
      const data = await refreshToken();
      token = data.access_token;
      sessionStorage.setItem("access_token", token);
    } catch {
      return null;
    }
  }

  return token;
}

async function logoutUser() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
    {
      method: "POST",
      credentials: "include", // envia cookies
    }
  );

  if (!res.ok) throw new Error("Erro ao fazer logout");

  return res.json();
}

// Hook
export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Remove o access_token da memória/local
      sessionStorage.removeItem("access_token");

      // Redireciona para login
      window.location.href = "/sign-in";
    },
  });
}
