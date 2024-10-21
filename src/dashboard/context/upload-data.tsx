import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useDataProvider, useInvalidate } from "@refinedev/core";

import {
  checkUnfinishedUploads,
  clearUnfinishedUploads,
  initiateMultipartUpload,
  saveUnfinishedUpload,
  UploadDataProps,
  uploadMultipartFile,
} from "@/dashboard/routes/files/helper";

type UploadDataType = {
  fileQueue: UploadDataProps[];
  currentFile: UploadDataProps;
  isUploading: boolean;
  addFiles: (files: File[], projectId: string) => void;
  removeFile: (fileName: string) => void;
  uploadProgress: number;
  uploadRate: number;
  setCurrentFile: (file: UploadDataProps) => void;
  isUploadManagerVisible: boolean;
  openUploadManager: () => void;
  closeUploadManager: () => void;
};

const UploadContext = createContext<UploadDataType>(null);

export const useUpload = () => useContext(UploadContext);

export const UploadProvider = ({ children }) => {
  const [fileQueue, setFileQueue] = useState<UploadDataProps[]>([]);
  const [currentFile, setCurrentFile] = useState<UploadDataProps>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRate, setUploadRate] = useState(0);

  const [isUploadManagerVisible, setUploadManagerVisible] = useState(false);
  const openUploadManager = () => setUploadManagerVisible(true);
  const closeUploadManager = () => setUploadManagerVisible(false);
  const invalidate = useInvalidate();

  useEffect(() => {
    const unfinishedUploads = checkUnfinishedUploads();
    if (unfinishedUploads.length > 0) {
      const fileData = unfinishedUploads[0];
      setFileQueue([fileData]);
    }
  }, []);

  const startUpload = useCallback(async () => {
    if (fileQueue.length === 0 || isUploading || !fileQueue[0].fileObject)
      return;
    let uploadData = fileQueue[0];
    if (!uploadData) return;

    const { uploadId } = uploadData;

    setIsUploading(true);
    if (!uploadId) {
      const { uploadId, fileUrl, cdnUrl, chunkSize, totalParts, fileHash } =
        await initiateMultipartUpload(uploadData);

      uploadData = {
        ...uploadData,
        uploadId,
        fileUrl,
        cdnUrl,
        chunkSize,
        totalParts,
        fileHash,
      };
      setFileQueue((prev) =>
        prev.map((file) =>
          file.fileName === uploadData.fileName ? uploadData : file
        )
      );

      setCurrentFile(uploadData);

      saveUnfinishedUpload({
        ...uploadData,
        uploadId,
        fileUrl,
        cdnUrl,
        chunkSize,
        totalParts,
        fileHash,
      });
    }

    setFileQueue((prev) =>
      prev.filter((file) => file.fileName !== uploadData.fileName)
    );
    clearUnfinishedUploads(uploadData.fileName);
    try {
      const projectFile = await uploadMultipartFile(
        uploadData,
        (progress) => updateFileProgress(progress),
        (rate) => setUploadRate(rate)
      );
      if (projectFile) {
        invalidate({
          resource: "ProjectFile",
          invalidates: ["list"],
        });
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Error during upload:", error);
    }
  }, [fileQueue, isUploading, setUploadProgress, setUploadRate]);

  const updateFileProgress = (progress) => {
    setUploadProgress(progress);
  };

  const addFiles = (files, projectId) => {
    const newFiles = files.map((file) => ({
      fileName: file.name,
      fileType: file.type,
      fileObject: file,
      projectId,
      uploadId: null,
      fileUrl: null,
      cdnUrl: null,
      partNumber: 1,
      uploadProgress: 0,
      uploadRate: 0,
      parts: [],
      totalParts: null,
      chunkSize: null,
    }));

    setFileQueue((prev) => [...prev, ...newFiles]);
    openUploadManager();
  };

  const removeFile = (fileName) => {
    if (fileName === currentFile?.fileName) {
      setIsUploading(false);
      setCurrentFile(null);
    }
    setFileQueue((prev) => prev.filter((file) => file.fileName !== fileName));
    clearUnfinishedUploads(fileName);
  };

  useEffect(() => {
    if (fileQueue.length > 0 && !isUploading) {
      startUpload();
    }
  }, [fileQueue, isUploading]);

  return (
    <UploadContext.Provider
      value={{
        fileQueue,
        currentFile,
        isUploading,
        addFiles,
        removeFile,
        uploadProgress,
        uploadRate,
        setCurrentFile,
        isUploadManagerVisible,
        openUploadManager,
        closeUploadManager,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
