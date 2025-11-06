import React, { useState, useRef } from "react";
import { X, Smile, Upload, Trash2 } from "lucide-react";
import { Note } from "./types";

interface AddNoteModalProps {
  onClose: () => void;
  onAdd: (note: Omit<Note, 'id' | 'createdAt' | 'lastUpdated'>) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    mood: "happy",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { value: "happy", label: "😊 Happy", color: "bg-green-100 text-green-800" },
    { value: "excited", label: "🎉 Excited", color: "bg-yellow-100 text-yellow-800" },
    { value: "relieved", label: "😌 Relieved", color: "bg-blue-100 text-blue-800" },
    { value: "thoughtful", label: "🤔 Thoughtful", color: "bg-purple-100 text-purple-800" },
    { value: "tired", label: "😴 Tired", color: "bg-gray-100 text-gray-800" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    onAdd({
      ...formData,
      photo: photo || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Write New Note</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's this note about?"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.value })}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    formData.mood === mood.value
                      ? `${mood.color} ring-2 ring-bloomPink`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photo (Optional)
            </label>
            {photo ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-bloomPink hover:bg-pink-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-gray-600">Click to add a photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your thoughts, memories, or important information..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter"
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-pink-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim()}
              className="flex-1 bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Save Note
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;