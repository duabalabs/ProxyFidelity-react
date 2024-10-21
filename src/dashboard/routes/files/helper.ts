import axios from "axios";
import Parse from "parse";
import SparkMD5 from "spark-md5";

import { ProjectFile } from "@/dashboard/lib";

export const initiateMultipartUpload = async (
  uploadData: UploadDataProps
): Promise<UploadDataProps> => {
  try {
    const { fileObject, fileName, fileType, projectId } = uploadData;
    // Call the Parse Cloud function
    const response = await Parse.Cloud.run("initiateMultipartUpload", {
      fileName,
      fileType,
      projectId,
    });

    // Extract relevant data from the response
    const { uploadId, fileUrl, cdnUrl } = response;
    const chunkSize = 10 * 1024 * 1024; // 10MB per part
    const totalParts = Math.ceil(fileObject.size / chunkSize);
    const fileHash = await hashFileFirstAndLastChunks(fileObject);
    return {
      uploadId,
      fileUrl,
      cdnUrl,
      chunkSize,
      totalParts,
      fileHash,
    };
  } catch (error) {
    console.error("Error initiating multipart upload:", error);
    throw new Error("Failed to initiate multipart upload.");
  }
};

export const uploadMultipartFile = async (
  currentFile: UploadDataProps, // Current file being uploaded
  setUploadProgress: (progress: number) => void, // Callback to set upload progress
  setUploadRate: (rate: number) => void // Callback to set upload rate
): Promise<ProjectFile> => {
  const {
    fileName,
    fileType,
    fileObject,
    projectId,
    uploadId,
    chunkSize,
    totalParts,
    parts,
    fileUrl,
    cdnUrl,
    fileHash,
  } = currentFile;

  const startTime = Date.now(); // Track time for upload rate calculation

  for (let i = parts.length + 1; i <= totalParts; i++) {
    const start = (i - 1) * chunkSize;
    const end = Math.min(i * chunkSize, fileObject.size);
    const fileChunk = fileObject.slice(start, end);

    // Generate presigned URL for the current part
    const { presignedUrl } = await Parse.Cloud.run(
      "generateMultipartPresignedUrl",
      {
        fileName,
        partNumber: i,
        uploadId,
        projectId,
      }
    );

    // Upload the current part to DigitalOcean Spaces
    const result = await axios.put(presignedUrl, fileChunk, {
      headers: {
        "Content-Type": fileType ?? "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const percentDone = Math.round(
          ((i - 1 + progressEvent.loaded / fileChunk.size) / totalParts) * 100
        );
        setUploadProgress(percentDone); // Update overall progress
        const timeElapsed = (Date.now() - startTime) / 1000;
        const uploadSpeed = fileObject.size / 1024 / 1024 / timeElapsed; // MB/s
        setUploadRate(uploadSpeed);
      },
    });

    // Save the uploaded part details (ETag and PartNumber)
    const uploadedPart = {
      ETag: result.headers.etag, // ETag is needed to complete the multipart upload
      PartNumber: i,
    };
    currentFile.parts.push(uploadedPart); // Add the uploaded part to the parts list

    // Persist the updated file info with parts to local storage for resumable upload
    saveUnfinishedUpload({
      ...currentFile,
      parts: currentFile.parts,
    });
  }
  const projectFile = (await Parse.Cloud.run("completeMultipartUpload", {
    fileName,
    uploadId,
    parts: currentFile.parts,
    projectId,
    fileUrl,
    cdnUrl,
    fileType,
    fileHash,
  })) as ProjectFile;

  return projectFile;
};

export const checkUnfinishedUploads = () => {
  const unfinishedUploads =
    JSON.parse(localStorage.getItem("unfinishedUploads")) || [];
  return unfinishedUploads;
};

export type UploadDataProps = {
  fileObject?: File;
  fileName?: string;
  fileType?: string;
  uploadId?: string;
  projectId?: string;
  parts?: Array<{ PartNumber: number; ETag: string }>;
  totalParts?: number;
  chunkSize?: number;
  partNumber?: number;
  fileUrl?: string;
  cdnUrl?: string;
  fileHash?: string;
};

export const saveUnfinishedUpload = (uploadData: UploadDataProps) => {
  const { fileObject, ...uploadDataToSave } = uploadData;
  const unfinishedUploads: UploadDataProps[] =
    JSON.parse(localStorage.getItem("unfinishedUploads")) || [];

  // Find if the file already exists in the unfinishedUploads
  const existingFileIndex = unfinishedUploads.findIndex(
    (upload) =>
      upload.fileName === uploadDataToSave.fileName &&
      upload.projectId === uploadDataToSave.projectId
  );

  if (existingFileIndex >= 0) {
    const existingUploadData = unfinishedUploads[existingFileIndex];
    unfinishedUploads[existingFileIndex] = {
      ...existingUploadData,
      ...uploadDataToSave,
    };
  } else {
    unfinishedUploads.push(uploadDataToSave);
  }

  localStorage.setItem("unfinishedUploads", JSON.stringify(unfinishedUploads));
};

export const clearUnfinishedUploads = (fileName) => {
  const unfinishedUploads = checkUnfinishedUploads().filter(
    (file) => file.fileName !== fileName
  );
  localStorage.setItem("unfinishedUploads", JSON.stringify(unfinishedUploads));
};

const arrayBufferToBinaryString = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
};

// Function to hash first and last chunks of a file
export const hashFileFirstAndLastChunks = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunkSize = 5 * 1024 * 1024; // 5MB for chunk hashing
    const firstChunk = file.slice(0, chunkSize);
    const lastChunk = file.slice(file.size - chunkSize, file.size);
    const spark = new SparkMD5();

    const reader = new FileReader();
    let isFirstChunkLoaded = false;

    // Load the first chunk and hash it
    reader.onloadend = function (e) {
      if (e.target.readyState !== FileReader.DONE) return;

      const binaryStr = arrayBufferToBinaryString(
        e.target.result as ArrayBuffer
      );
      spark.appendBinary(binaryStr);

      if (!isFirstChunkLoaded) {
        // Load the last chunk after the first chunk is processed
        isFirstChunkLoaded = true;
        reader.readAsArrayBuffer(lastChunk);
      } else {
        // Finish hashing and return the result after processing both chunks
        const hash = spark.end();
        resolve(hash);
      }
    };

    // Start by reading the first chunk
    reader.onerror = reject;
    reader.readAsArrayBuffer(firstChunk);
  });
};
