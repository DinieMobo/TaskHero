/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - A promise that resolves to the uploaded file URL
 */
export const uploadFile = async (file) => {
  try {
    // Create form data to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'taskhero_uploads'); // You may need to change this to your actual Cloudinary upload preset

    // Use Vite's import.meta.env instead of process.env
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    
    // Make the API call to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload file to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
