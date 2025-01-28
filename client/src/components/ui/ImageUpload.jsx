import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import {toast, ToastContainer} from "react-toastify";

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pharma connect"); // Your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwmae0ztq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log("Uploaded Image URL:", result.secure_url);

      onUpload(result.secure_url);
      toast.success("image uploaded succesfully") ;
      setIsUploaded(true)// Pass the uploaded image URL to parent
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("error uploading the image")
    }
    finally {
      setIsLoading(false);
      
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setIsUploaded(false);
    toast.success("image deleted successfully!")
  };

  return (
  
    <div className="flex flex-col items-center justify-center">
       
      <div className="relative w-28 h-28 rounded-full flex items-center justify-center">
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              className="w-full h-full object-cover rounded-full"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2Icon />
            </button>
          </>
        ) : (
          <label
      className="flex flex-col items-center justify-center cursor-pointer w-28 h-28 rounded-full bg-gray-100 border border-dashed border-gray-300"
      style={{
        backgroundImage: currentUser?.avatar
          ? `url(${currentUser.avatar})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Show "+" icon and "Upload" text only if no avatar exists */}
      {!currentUser?.avatar && (
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

      {file && !isUploaded && (
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
