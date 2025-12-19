import React from "react";
import { Modal } from "../ui/modal";
import { Spinner } from "../ui/spinner";

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  onClose,
  title = "",
  description = "",
}) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex justify-center space-x-2 pt-6">
        <Spinner className="size-17" color="#2b7fff" />
      </div>
    </Modal>
  );
};
