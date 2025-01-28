import { Trash2Icon } from "lucide-react";
import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pharma connect"); // Replace with your actual Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwmae0ztq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("Uploaded Image URL:", result.secure_url);
        onUpload(result.secure_url);
        // toast.success("Image uploaded successfully!");
        // Reset the file after successful upload
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    //   toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div>
      {/* <ToastContainer /> */}
      <div className="relative w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2Icon />
            </button>
          </>
        ) : (
          <label
          className="flex flex-col items-center justify-center cursor-pointer w-28 h-28 bg-gray-100 "
          style={{
            backgroundImage: file
              ? `url(${secure_url})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Show "+" icon and "Upload" text only if no avatar exists */}
          {!file && (
            <>
              <span className="text-gray-400 text-xl">+</span>
              <span className="text-gray-500 text-xs">Upload</span>
            </>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`mt-4 px-4 py-2 rounded-md text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          }`}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
