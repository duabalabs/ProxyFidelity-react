import { useEffect, useRef, useState } from "react";

import { message } from "antd";
import Parse from "parse";

import { ProjectFile } from "../lib";

export const useFetchPresignedUrl = (files: ProjectFile[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preSignedUrlFiles, setPreSignedUrlFiles] = useState<ProjectFile[]>([]);
  const prevFilesRef = useRef<ProjectFile[]>([]); // To track previous `files` value

  const isUrlExpired = (expiryDate?: Date): boolean => {
    if (!expiryDate) return true;
    const now = new Date();
    return now >= new Date(expiryDate);
  };

  const fetchPresignedUrl = async (newFiles: ProjectFile[]) => {
    setIsLoading(true);

    const updatedFiles: ProjectFile[] = [];

    await Promise.all(
      newFiles.map(async (file) => {
        if (
          file.filePath &&
          !(file.presignedUrl && !isUrlExpired(file.presignedUrlExpiry))
        ) {
          try {
            const response = await Parse.Cloud.run(
              "generateReadOnlyPresignedFileUrl",
              {
                filePath: file.filePath,
                fileType: file.fileType,
              }
            );
            const { presignedUrl, expirationDate } = response;

            file.presignedUrl = presignedUrl;
            file.presignedUrlExpiry = new Date(expirationDate);
          } catch (error) {
            message.error("Failed to generate a download link.");
          }
        }
        updatedFiles.push(file);
      })
    );

    setPreSignedUrlFiles(updatedFiles);
    setIsLoading(false);
  };

  useEffect(() => {
    // Compare `files` with `prevFilesRef.current` to prevent unnecessary re-fetching
    if (
      files &&
      (files.length !== prevFilesRef.current.length ||
        files.some(
          (file, index) => file.id !== prevFilesRef.current[index]?.id
        ))
    ) {
      prevFilesRef.current = files; // Update the reference
      fetchPresignedUrl(files);
    }
  }, [files]);

  return { preSignedUrlFiles, isLoading };
};
