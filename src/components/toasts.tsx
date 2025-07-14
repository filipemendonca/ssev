import { toast } from "sonner";

interface ToastProps {
  header: string;
  description: string;
}
export const toastSuccess = ({ header, description }: ToastProps) =>
  toast.success(<strong>{header}</strong>, {
    description: <span className="text-white">{description}</span>,
    style: {
      backgroundColor: "green",
      borderColor: "green",
      color: "white",
    },
    classNames: {
      description: "text-white",
    },
  });

export const toastError = ({ header, description }: ToastProps) =>
  toast.error(<strong>{header}</strong>, {
    description: <span className="text-white">{description}</span>,
    style: {
      backgroundColor: "red",
      borderColor: "red",
      color: "white",
    },
    classNames: {
      description: "text-white",
    },
  });

export const toastInfo = ({ header, description }: ToastProps) =>
  toast.info(<strong>{header}</strong>, {
    description: <span className="text-white">{description}</span>,
    style: {
      backgroundColor: "#007FFF",
      borderColor: "#007FFF",
      color: "white",
    },
    classNames: {
      description: "text-white",
    },
  });

export const toastWarning = ({ header, description }: ToastProps) =>
  toast.warning(<strong>{header}</strong>, {
    description: <span className="text-white">{description}</span>,
    style: {
      backgroundColor: "orange",
      borderColor: "orange",
      color: "white",
    },
    classNames: {
      description: "text-white",
    },
  });
