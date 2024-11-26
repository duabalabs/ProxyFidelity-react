import { useEffect, useState } from "react";

import { message } from "antd";
import Parse from "parse";

import { ProjectFile } from "../lib";

export const useFetchPresignedUrl = (files: ProjectFile[]) => {
  const [loading, setLoading] = useState(true);
  const [preSignedUrlFiles, setPreSignedUrlFiles] = useState([]);

  const isUrlExpired = (expiryDate?: Date): boolean => {
    if (!expiryDate) return true;
    const now = new Date();
    return now >= new Date(expiryDate);
  };

  const fetchPresignedUrl = async () => {
    setLoading(true);

    if (files?.length > 0) {
      const newstuff = [];
      await Promise.all(
        files.map(async (file) => {
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
              newstuff.push(file);
            } catch (error) {
              message.error("Failed to generate a download link.");
            }
          }
        })
      );
      setPreSignedUrlFiles(newstuff);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresignedUrl();
  }, [files]);
  return { preSignedUrlFiles, loading };
};
