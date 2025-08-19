import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAuthForm } from "./components/user-auth-form";

export default async function Page() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Login</CardTitle>
        <CardDescription>
          Entre com seu email e senha abaixo <br />
          para logar no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
      </CardContent>
    </Card>
  );
}
