import { useState, useRef } from "react";
import { ImageIcon, SendIcon, XIcon, FileIcon, SearchIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../../auth/useAuthStore";
import useKeyboardSound from "../../../../hooks/useKeyboardSound";
import toast from "react-hot-toast";

const GroupMessageInput = ({ groupId, onShowSearch }) => {
  const { sendGroupMessage, emitTyping, isSoundEnabled } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { playKeystrokeSound } = useKeyboardSound();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !filePreview) return;

    if (isSoundEnabled) {
      playKeystrokeSound();
    }

    sendGroupMessage(groupId, {
      text: text.trim(),
      image: imagePreview || null,
      file: filePreview || null,
    });

    setText("");
    setImagePreview(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (isSoundEnabled) {
      playKeystrokeSound();
    }

    // Emit typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitTyping(groupId, authUser?.username);

    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing indicator
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview({
        name: file.name,
        url: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="border-t border-slate-700/50 p-4 bg-slate-800/30 backdrop-blur-sm">
      {/* Preview Area */}
      {(imagePreview || filePreview) && (
        <div className="max-w-4xl mx-auto mb-3 flex flex-wrap gap-3">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block animate-in fade-in slide-in-from-bottom-2 duration-300">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border border-slate-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                type="button"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* File Preview */}
          {filePreview && (
            <div className="relative inline-block animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="h-24 w-24 bg-slate-700/50 border border-slate-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-300 truncate px-1">
                    {filePreview.name.substring(0, 12)}...
                  </span>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                type="button"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-4xl mx-auto flex items-end gap-3"
      >
        {/* Hidden File Inputs */}
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        {/* Input Field */}
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 placeholder-slate-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 text-sm transition-all duration-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            type="button"
            onClick={onShowSearch}
            className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            title="Search messages"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Image Upload */}
          <label
            htmlFor="image-upload"
            className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </label>

          {/* File Upload */}
          <label
            htmlFor="file-upload"
            className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Upload file"
          >
            <FileIcon className="w-5 h-5" />
          </label>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview && !filePreview}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
            title="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupMessageInput;
