import axios from "axios";
import Parse from "parse";

export const uploadMultipartFile = async (
  fileObject,
  name,
  type,
  projectId,
  setUploadProgress,
  setUploadRate
) => {
  const startTime = Date.now();
  const chunkSize = 10 * 1024 * 1024; // 10MB per part
  const totalParts = Math.ceil(fileObject.size / chunkSize);

  // Retrieve all unfinished uploads from localStorage
  const unfinishedUploads = checkUnfinishedUploads();

  // Check if the current file already has an unfinished upload
  const uploadDetails = unfinishedUploads.find(
    (upload) => upload.name === name
  );

  // Destructure the necessary variables
  let { uploadId, fileUrl, cdnUrl, parts } = uploadDetails || {};
  parts = parts || []; // Ensure parts is initialized as an empty array if undefined

  let newUploadId, filePath;

  if (!uploadId) {
    // If no uploadId exists, initiate a new multipart upload
    ({
      uploadId: newUploadId,
      filePath,
      fileUrl,
      cdnUrl,
    } = await Parse.Cloud.run("initiateMultipartUpload", {
      fileName: name,
      fileType: type,
      projectId,
    }));

    // Update the uploadId for this file
    uploadId = newUploadId;

    // Save this new unfinished upload back to localStorage
    saveUnfinishedUpload({ name, fileUrl, cdnUrl, uploadId, parts });
  } else {
    // Existing upload found, so resuming the upload process
    console.log(`Resuming upload for file: ${name}`);
  }

  const partNumber = parts.length + 1; // Resume from the next part

  for (let i = partNumber; i <= totalParts; i++) {
    const start = (i - 1) * chunkSize;
    const end = Math.min(i * chunkSize, fileObject.size);
    const fileChunk = fileObject.slice(start, end);

    const { presignedUrl } = await Parse.Cloud.run(
      "generateMultipartPresignedUrl",
      {
        fileName: name,
        partNumber: i,
        uploadId,
        projectId,
      }
    );

    const result = await axios.put(presignedUrl, fileChunk, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const percentDone = Math.round(
          ((i - 1 + progressEvent.loaded / fileChunk.size) / totalParts) * 100
        );
        setUploadProgress(percentDone);

        const timeElapsed = (Date.now() - startTime) / 1000;
        const uploadSpeed = fileObject.size / 1024 / 1024 / timeElapsed;
        setUploadRate(uploadSpeed);
      },
    });

    parts.push({
      ETag: result.headers.etag,
      PartNumber: i,
    });
    localStorage.setItem(`parts_${name}`, JSON.stringify(parts));
  }

  await Parse.Cloud.run("completeMultipartUpload", {
    fileName: name,
    uploadId,
    parts,
    projectId,
  });

  clearUnfinishedUploads(name);

  return { fileUrl, cdnUrl };
};

export const checkUnfinishedUploads = () => {
  const unfinishedUploads =
    JSON.parse(localStorage.getItem("unfinishedUploads")) || [];
  return unfinishedUploads;
};

export const saveUnfinishedUpload = (fileDetails) => {
  const unfinishedUploads = checkUnfinishedUploads();
  unfinishedUploads.push(fileDetails);
  localStorage.setItem("unfinishedUploads", JSON.stringify(unfinishedUploads));
};

export const clearUnfinishedUploads = (fileName) => {
  const unfinishedUploads = checkUnfinishedUploads().filter(
    (file) => file.name !== fileName
  );
  localStorage.setItem("unfinishedUploads", JSON.stringify(unfinishedUploads));
};
