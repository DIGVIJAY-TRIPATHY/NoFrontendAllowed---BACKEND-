import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        // upload file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file after successful upload
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the opeartion got failed
        return null
    }
}

const extractPublicId = (url) => {
    if (!url) return null;

    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, "");

    return withoutExtension || null;
}

const deleteFromCloudinary = async (url, resourceType = "image") => {
    try {
        const publicId = extractPublicId(url);

        if (!publicId) return null;

        // delete file from cloudinary
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (error) {
        console.log("cloudinary delete failed", error);
        return null;
    }
}


export {uploadOnCloudinary, deleteFromCloudinary};

