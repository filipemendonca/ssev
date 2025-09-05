"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../ui/modal";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickButton1?: () => void;
  onClickButton2?: () => void;
  loading: boolean;
  title: string;
  description: string;
  buttonText1?: string;
  buttonText2?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  onClickButton1,
  onClickButton2,
  loading,
  title,
  description,
  buttonText1 = "Cancelar",
  buttonText2 = "Continuar",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClickButton1}
          className="cursor-pointer"
        >
          {buttonText1}
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onClickButton2}
          className="cursor-pointer"
        >
          {buttonText2}
        </Button>
      </div>
    </Modal>
  );
};
