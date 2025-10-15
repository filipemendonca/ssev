import { Button } from "@/components/ui/button";
import { fetcher } from "@/utils/fetcher";
import { Download, File } from "lucide-react";

interface FileInformationProps {
  fileName: string;
}

const FileInformation = ({ fileName }: FileInformationProps) => {
  const downloadFile = async () => {
    try {
      const blob = await fetcher<Blob>(
        `/examsResultTemplate/download/${fileName}`,
        { method: "GET" },
        false, // multipartFormData
        true // isFileDownload 👈
      );

      // cria uma URL temporária para o blob
      const url = window.URL.createObjectURL(blob);

      // cria um link e simula o clique
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // limpa recursos
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 border rounded-xl shadow-sm bg-white">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <File className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-800">{fileName}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => downloadFile()}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileInformation;
