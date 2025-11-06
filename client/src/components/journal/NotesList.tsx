import React, { useState } from "react";
import { Edit3, Trash2, Calendar, Clock, Tag } from "lucide-react";
import EditNoteModal from "./EditNoteModal";
import { Note } from "./types";


// interface Note {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   lastUpdated: string;
//   tags: string[];
//   mood: string;
// }

interface NotesListProps {
  notes: Note[];
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onUpdateNote, onDeleteNote }) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: "bg-green-100 text-green-800",
      excited: "bg-yellow-100 text-yellow-800",
      relieved: "bg-blue-100 text-blue-800",
      thoughtful: "bg-purple-100 text-purple-800",
      tired: "bg-gray-100 text-gray-800"
    };
    return moodColors[mood] || "bg-gray-100 text-gray-800";
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Edit3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No notes yet</h3>
        <p className="text-gray-500">Write your first note to capture your thoughts and memories</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-xl">{note.title}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingNote(note)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mood */}
            <div className="mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(note.mood)}`}>
                {note.mood}
              </span>
            </div>

            {/* Content */}
            <div className="text-gray-600 mb-4 whitespace-pre-line leading-relaxed">
              {note.content}
            </div>

            {note.photo && (
            <div className="mt-3 rounded-xl overflow-hidden">
                <img 
                src={note.photo} 
                alt="Note attachment" 
                className="w-full h-48 object-cover"
                />
            </div>
            )}

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Dates */}
            <div className="space-y-1 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Created: {formatDate(note.createdAt)} at {formatTime(note.createdAt)}</span>
              </div>
              {note.lastUpdated !== note.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated: {formatDate(note.lastUpdated)} at {formatTime(note.lastUpdated)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onUpdate={onUpdateNote}
        />
      )}
    </div>
  );
};

export default NotesList;