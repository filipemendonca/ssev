"use client";
import { useApiQuery } from "@/hooks/use-api-query";
import { GenericResponse } from "@/types";
import { Profile } from "../types";
import ProfileForm from "./profile-form";

export default function ProfileViewPage() {
  const { data } = useApiQuery<GenericResponse<Profile>>(
    ["getProfile"],
    `/profile`
  );

  const users = data?.data;

  return <ProfileForm initialData={users} />;
}
