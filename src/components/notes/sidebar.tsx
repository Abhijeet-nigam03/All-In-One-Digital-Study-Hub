import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button, buttonVariants } from "@/components/ui/button"
import { Folder, FileText, Plus, MoreVertical, Trash2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export type Note = { id: number; title: string; content?: string }
export type FolderType = { id: number; name: string; notes: Note[] }

interface NotesSidebarProps {
  className?: string;
  folders: FolderType[];
  activeNoteId: number | null;
  onSelectNote: (note: Note, folderId: number) => void;
  onAddFolder: () => void;
  onAddNote: (folderId: number) => void;
  onDeleteFolder: (folderId: number) => void;
  onRenameFolder: (folderId: number, newName: string) => void;
  onRenameNote: (folderId: number, noteId: number, newTitle: string) => void;
  onDeleteNote: (folderId: number, noteId: number) => void;
}

export function NotesSidebar({ 
  className, 
  folders, 
  activeNoteId, 
  onSelectNote, 
  onAddFolder, 
  onAddNote, 
  onDeleteFolder,
  onRenameFolder,
  onRenameNote,
  onDeleteNote 
}: NotesSidebarProps) {
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [editFolderName, setEditFolderName] = useState("")

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editNoteTitle, setEditNoteTitle] = useState("")
  const [activeFolderForNoteEdit, setActiveFolderForNoteEdit] = useState<number | null>(null)

  const startEditing = (folder: FolderType) => {
    setEditingFolderId(folder.id)
    setEditFolderName(folder.name)
  }

  const saveEditing = () => {
    if (editingFolderId && editFolderName.trim()) {
      onRenameFolder(editingFolderId, editFolderName.trim())
    }
    setEditingFolderId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing()
    if (e.key === 'Escape') setEditingFolderId(null)
  }

  const startEditingNote = (note: Note, folderId: number) => {
    setEditingNoteId(note.id)
    setEditNoteTitle(note.title)
    setActiveFolderForNoteEdit(folderId)
  }

  const saveEditingNote = () => {
    if (editingNoteId && activeFolderForNoteEdit && editNoteTitle.trim()) {
      onRenameNote(activeFolderForNoteEdit, editingNoteId, editNoteTitle.trim())
    }
    setEditingNoteId(null)
    setActiveFolderForNoteEdit(null)
  }

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditingNote()
    if (e.key === 'Escape') {
      setEditingNoteId(null)
      setActiveFolderForNoteEdit(null)
    }
  }
  
  return (
    <div className={`w-64 border-r bg-muted/20 flex flex-col h-full shrink-0 ${className || ''}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">My Notes 📝</h2>
        <Button onClick={onAddFolder} variant="ghost" size="icon" className="h-8 w-8" title="New Folder">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {folders.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No folders yet. Click + to create one.
            </div>
          )}
          {folders.map((folder) => (
            <div key={folder.id} className="space-y-1">
              <div className="flex items-center px-2 py-1 text-sm font-medium text-muted-foreground group relative">
                <div className="flex items-center gap-2 flex-1 min-w-0 pr-8">
                  <Folder className="h-4 w-4 shrink-0" />
                  {editingFolderId === folder.id ? (
                    <Input 
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onBlur={saveEditing}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="h-6 py-0 px-1 text-xs"
                    />
                  ) : (
                    <span className="truncate">{folder.name}</span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 data-[state=open]:opacity-100 shrink-0" })}>
                    <MoreVertical className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onAddNote(folder.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note ✍️
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => startEditing(folder)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename Folder ✏️
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Folder 🗑️
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1 pl-6">
                {folder.notes.map((note) => (
                  <div key={note.id} className="flex items-center group/note relative">
                    <Button
                      variant={activeNoteId === note.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start font-normal h-8 text-xs pr-8 truncate"
                      onClick={() => onSelectNote(note, folder.id)}
                    >
                      <FileText className="h-3 w-3 mr-2 text-primary/70 shrink-0" />
                      {editingNoteId === note.id ? (
                        <Input 
                          value={editNoteTitle}
                          onChange={(e) => setEditNoteTitle(e.target.value)}
                          onBlur={saveEditingNote}
                          onKeyDown={handleNoteKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="h-6 py-0 px-1 text-xs"
                        />
                      ) : (
                        <span className="truncate">{note.title}</span>
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/note:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 shrink-0" })}>
                        <MoreVertical className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => startEditingNote(note, folder.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename ✏️
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteNote(folder.id, note.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete 🗑️
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
