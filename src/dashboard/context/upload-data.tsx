import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  checkUnfinishedUploads,
  clearUnfinishedUploads,
  initiateMultipartUpload,
  saveUnfinishedUpload,
  saveUploadedFileToParse, // The function to get the uploadId and URLs
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
  const [fileQueue, setFileQueue] = useState([]);
  const [currentFile, setCurrentFile] = useState<UploadDataProps>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRate, setUploadRate] = useState(0);

  const [isUploadManagerVisible, setUploadManagerVisible] = useState(false);
  const openUploadManager = () => setUploadManagerVisible(true);
  const closeUploadManager = () => setUploadManagerVisible(false);

  // Load unfinished uploads from localStorage on initial load
  useEffect(() => {
    const unfinishedUploads = checkUnfinishedUploads();
    if (unfinishedUploads.length > 0) {
      const fileData = unfinishedUploads[0]; // Only the currently uploading file matters
      setFileQueue([fileData]); // Ensure this file is in the queue
    }
  }, []);

  const startUpload = useCallback(async () => {
    console.log("start upload", fileQueue, isUploading);
    if (fileQueue.length === 0 || isUploading) return;
    let uploadData = fileQueue[0];
    console.log("how many ");
    if (!uploadData) return;

    const { uploadId } = uploadData;

    setIsUploading(true);
    if (!uploadId) {
      // Initiate multipart upload for the first time and get all necessary data
      const { uploadId, fileUrl, cdnUrl, chunkSize, totalParts, fileHash } =
        {} as any;
      // await initiateMultipartUpload(uploadData);

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
      // Update the current file with the new data
      setCurrentFile(uploadData);

      // Save updated data to localStorage
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

    try {
      // await uploadMultipartFile(
      //   uploadData,
      //   (progress) => updateFileProgress(progress),
      //   (rate) => setUploadRate(rate)
      // );

      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10; // Increase progress by 5%
          updateFileProgress(newProgress);

          if (newProgress >= 100) {
            clearInterval(interval);
            setFileQueue((prev) =>
              prev.filter((file) => file.fileName !== uploadData.fileName)
            ); // Remove completed file from queue
            clearUnfinishedUploads(uploadData.fileName); // Clear from local storage

            // Save to Parse or any other action you need once upload is done
            // saveUploadedFileToParse(uploadData);

            setIsUploading(false);
            return 0;
          }

          return newProgress;
        });

        setUploadRate(Math.random() * 100); // Arbitrary rate value for testing
      }, 1000);

      // Timeout after 3 minutes
      // const timeout = setTimeout(() => {
      //   clearInterval(interval);
      //   setFileQueue((prev) =>
      //     prev.filter((file) => file.fileName !== uploadData.fileName)
      //   ); // Remove completed file from queue
      //   clearUnfinishedUploads(uploadData.fileName); // Clear from local storage

      //   // Save to Parse or any other action you need once upload is done
      //   // saveUploadedFileToParse(uploadData);

      //   setIsUploading(false);
      // }, 20000);

      // return () => clearTimeout(timeout);

      // setFileQueue((prev) =>
      //   prev.filter((file) => file.fileName !== uploadData.fileName)
      // ); // Remove completed file from queue
      // clearUnfinishedUploads(uploadData.fileName); // Clear from local storage

      // // // Save to Parse or any other action you need once upload is done
      // // saveUploadedFileToParse(uploadData);

      // setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
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
      uploadId: null, // This will be generated when upload starts
      fileUrl: null,
      cdnUrl: null,
      partNumber: 1, // Start at part 1
      uploadProgress: 0,
      uploadRate: 0,
      parts: [], // This will hold part details for resumable upload
      totalParts: null, // Calculated later
      chunkSize: null, // Set when the upload starts
    }));

    setFileQueue((prev) => [...prev, ...newFiles]);
    openUploadManager();
  };

  const removeFile = (fileName) => {
    if (fileName === currentFile?.fileName) {
      setIsUploading(false); // Stop current upload
      setCurrentFile(null); // Clear the current file
    }
    setFileQueue((prev) => prev.filter((file) => file.fileName !== fileName));
    clearUnfinishedUploads(fileName); // Clear from local storage
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
