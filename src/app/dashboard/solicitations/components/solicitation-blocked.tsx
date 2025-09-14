"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { Solicitations } from "../data-table/columns";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { SolicitationStatus } from "../types/types";
import { LockIcon, UnlockIcon } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { GenericResponse } from "@/types";
import { useUserStore } from "@/context/stores/user.store";
import { useConfigureButtonToSolicitations } from "@/hooks/use-configure-buttons-to-solicitation";

const formSchema = z.object({
  blockedCause: z.string(),
});

type blockForm = z.infer<typeof formSchema>;

interface SolicitationBlockedProps {
  initialData: Solicitations | undefined;
  pageTitle: string;
}

export default function SolicitationBlocked({
  initialData,
  pageTitle,
}: Readonly<SolicitationBlockedProps>) {
  const { user } = useUserStore();
  const status = initialData ? initialData.status : null;
  const { enableBlockSolicitationButton } = useConfigureButtonToSolicitations(
    status,
    user ? user.role : null
  );
  const form = useForm<blockForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { blockedCause: initialData?.blockedCause || "" },
  });

  const { mutateAsync: blockUnblockSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/blockUnblockSolicitation/${initialData?.id}`,
    method: "PATCH",
    queryKeys: ["blockUnblockSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const handleUnblockSolicitation = async () => {
    await blockUnblockSolicitationAsync({} as never);
    window.location.reload();
  };

  const renderBlockSolicitationButton = () =>
    initialData && enableBlockSolicitationButton ? (
      <Button
        type="submit"
        className="cursor-pointer mr-2"
        onClick={() => handleUnblockSolicitation()}
      >
        {initialData?.status === SolicitationStatus.BLOQUEADO ? (
          <UnlockIcon className="mr-2 h-4 w-4" />
        ) : (
          <LockIcon className="mr-2 h-4 w-4" />
        )}{" "}
        {initialData?.status === SolicitationStatus.BLOQUEADO
          ? "Desbloquear solicitação"
          : "Bloquear solicitação"}
      </Button>
    ) : (
      <></>
    );

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="flex justify-between text-2xl font-bold ">
          <div className="flex justify-between">{pageTitle}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-mr-4 w-full overflow-y-auto py-1 pr-4 mb-10">
          <p className="mb-10">
            <Label className="mb-2">Data e hora do bloqueio:</Label>{" "}
            <span>
              {initialData?.blockedAt ? (
                format(initialData?.blockedAt, "dd/MM/yyyy HH:mm:ss")
              ) : (
                <></>
              )}
            </span>
          </p>
          <Form {...form}>
            <FormField
              name="blockedCause"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Causa do Bloqueio</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>

        <Link
          href="/dashboard/solicitations"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "text-xs md:text-sm cursor-pointer mr-2"
          )}
        >
          <IconArrowLeft /> Voltar
        </Link>
        {renderBlockSolicitationButton()}
      </CardContent>
    </Card>
  );
}
