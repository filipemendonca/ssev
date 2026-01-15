import { toastError } from "@/components/toasts";
import { GenericResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

type ForgotPasswordPayload = {
  email: string;
};

interface ForgotPasswordResponse {
  message: string;
}

async function handleForgotPassword(
  data: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store", // evita cache
    }
  );

  if (!res.ok) {
    const errorResponse = (await res.json()) as ForgotPasswordResponse;
    throw new Error(
      errorResponse.message || "Erro ao tentar recuperar a senha."
    );
  }

  return res.json();
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: handleForgotPassword,
    onError: (err) => {
      toastError({
        header: "Erro!",
        description: `${err.message}`,
      });
    },
  });
}

type ResetPasswordPayload = {
  password: string;
};

interface ResetPasswordResponse {
  message: string;
}

async function handleResetPassword(
  data: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store", // evita cache
    }
  );

  if (!res.ok) {
    const errorResponse = (await res.json()) as ResetPasswordResponse;
    throw new Error(
      errorResponse.message || "Erro ao tentar recuperar a senha."
    );
  }

  return res.json();
}

export function useResetPassword(
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: handleResetPassword,
    onError: (err) => {
      toastError({
        header: "Erro!",
        description: `${err.message}`,
      });
      setIsLoading(false);
    },
  });
}

type CheckTokenPayload = {
  token: string;
};

type CheckTokenResponse = {
  valid: boolean;
};

async function handleCheckIfTokenIsValid(
  data: CheckTokenPayload
): Promise<GenericResponse<CheckTokenResponse>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-reset-token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store", // evita cache
    }
  );

  const response = (await res.json()) as GenericResponse<CheckTokenResponse>;

  if (!response.success) {
    throw new Error("Erro ao tentar recuperar a senha. Token inválido.");
  }

  return response;
}

export function useCheckIfTokenIsValid() {
  return useMutation<
    GenericResponse<CheckTokenResponse>,
    Error,
    CheckTokenPayload
  >({
    mutationFn: handleCheckIfTokenIsValid,
    onSuccess: () => {
      return true;
    },
    onError: (err) => {
      toastError({
        header: "Erro!",
        description: `${err.message}`,
      });
    },
  });
}
