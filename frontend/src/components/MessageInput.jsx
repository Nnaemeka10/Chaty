import toast from "react-hot-toast";
import useKeyboardSound from "../hooks/useKeyboardSound"
import  { useChatStore } from "../store/useChatStore";
import { useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

const MessageInput = () => {
    const { playKeystrokeSound } = useKeyboardSound();
    const  [text, setText] = useState( "" );
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);

    const { sendMessage, isSoundEnabled } = useChatStore();

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        if (isSoundEnabled) {
            playKeystrokeSound();
        }

        sendMessage( { 
            text: text.trim(), 
            image: imagePreview 
        } );

        setText( "" );
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
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

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

  return (
    <div className="border-t border-slate-700/50 p-4">
        {imagePreview && (
            <div className="max-w-3xl mx-auto mb-3 flex items-center"> 
                <div className="relative">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-lg border border-slate-700"
                    />
                    <button 
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6  bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full flex items-center justify-center"
                        type="button"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}

        <form 
            onSubmit={ handleSendMessage } 
            className="max-w-3xl mx-auto flex space-x-4"
        >
            <input 
                type="text" 
                placeholder="Type your message..."
                value={ text }
                onChange={ ( e ) => {
                    setText( e.target.value );
                    isSoundEnabled && playKeystrokeSound();
                }}
                className="flex-1 bg-slate-800/50 border border-slate-700/50 placeholder-slate-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-200"
            />

            <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
            />
            
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors rounded-lg px-4 ${ imagePreview ? "text-cyan-500" : ""}`}
            >
                <ImageIcon className="w-5 h-5" />
            </button>

            <button 
                type="submit"
                disabled={ !text.trim() && !imagePreview }
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg px-4 py-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </form>
    </div>
  );
}

export default MessageInput