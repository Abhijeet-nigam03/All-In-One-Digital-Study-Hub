"use client"

import { useState, useEffect } from "react"
import { NotesSidebar, FolderType, Note } from "@/components/notes/sidebar"
import { NoteEditor } from "@/components/notes/editor"
import { Button, buttonVariants } from "@/components/ui/button"
import { Save, Share, MoreHorizontal, Menu, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const initialFolders: FolderType[] = [
  {
    id: 1,
    name: "Mathematics",
    notes: [
      { id: 101, title: "Matrices", content: '<h1>Matrices</h1><p>A matrix is a rectangular array of numbers...</p>' },
      { id: 102, title: "Differential Calculus", content: '<h1>Differential Calculus</h1><p>Start writing...</p>' },
    ]
  },
  {
    id: 2,
    name: "Physics",
    notes: [
      { id: 201, title: "Quantum Physics", content: '<h1>Quantum Physics</h1><p>Start writing...</p>' },
    ]
  }
]

export default function NotesPage() {
  const [folders, setFolders] = useState<FolderType[]>(initialFolders)

  useEffect(() => {
    const saved = localStorage.getItem('global_notes')
    if (saved) {
      setFolders(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('global_notes', JSON.stringify(folders))
  }, [folders])
  const [activeNoteId, setActiveNoteId] = useState<number | null>(101)
  const [isSaved, setIsSaved] = useState(false)

  const activeFolder = folders.find(f => f.notes.some(n => n.id === activeNoteId))
  const activeNote = activeFolder?.notes.find(n => n.id === activeNoteId)

  const handleSelectNote = (note: Note) => {
    setActiveNoteId(note.id)
  }

  const handleContentChange = (content: string) => {
    if (!activeNoteId || !activeFolder) return
    setFolders(prev => prev.map(f => {
      if (f.id === activeFolder.id) {
        return {
          ...f,
          notes: f.notes.map(n => n.id === activeNoteId ? { ...n, content } : n)
        }
      }
      return f
    }))
  }

  const handleAddFolder = () => {
    const newFolder: FolderType = {
      id: Date.now(),
      name: "New Folder",
      notes: []
    }
    setFolders(prev => [...prev, newFolder])
  }

  const handleRenameFolder = (folderId: number, newName: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f))
  }

  const handleRenameNote = (folderId: number, noteId: number, newTitle: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          notes: f.notes.map(n => n.id === noteId ? { ...n, title: newTitle } : n)
        }
      }
      return f
    }))
  }

  const handleAddNote = (folderId: number) => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled Note",
      content: "<h1>Untitled Note</h1><p>Start typing...</p>"
    }
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, notes: [...f.notes, newNote] }
      }
      return f
    }))
    setActiveNoteId(newNote.id)
  }

  const handleDeleteFolder = (folderId: number) => {
    setFolders(prev => prev.filter(f => f.id !== folderId))
    if (activeFolder?.id === folderId) {
      setActiveNoteId(null)
    }
  }

  const handleDeleteNote = (folderId: number, noteId: number) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, notes: f.notes.filter(n => n.id !== noteId) }
      }
      return f
    }))
    if (activeNoteId === noteId) {
      setActiveNoteId(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-6 overflow-hidden border rounded-xl bg-background shadow-sm">
      <NotesSidebar 
        className="hidden md:flex" 
        folders={folders}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onAddFolder={handleAddFolder}
        onAddNote={handleAddNote}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onRenameNote={handleRenameNote}
        onDeleteNote={handleDeleteNote}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden pr-2">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 lg:hidden" aria-label="Toggle notes sidebar" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <NotesSidebar 
                  className="border-none w-full" 
                  folders={folders}
                  activeNoteId={activeNoteId}
                  onSelectNote={handleSelectNote}
                  onAddFolder={handleAddFolder}
                  onAddNote={handleAddNote}
                  onDeleteFolder={handleDeleteFolder}
                  onRenameFolder={handleRenameFolder}
                  onRenameNote={handleRenameNote}
                  onDeleteNote={handleDeleteNote}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg sm:text-xl font-bold truncate">
              {activeNote?.title || "No Note Selected"}
            </h1>
            {activeFolder && (
              <span className="hidden sm:inline-flex text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                {activeFolder.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span className={`hidden lg:inline text-xs transition-opacity duration-300 mr-4 ${isSaved ? 'text-green-500 font-medium opacity-100' : 'text-muted-foreground opacity-0'}`}>
              Saved!
            </span>
            <Button variant="outline" size="sm" className="hidden sm:flex" disabled={!activeNote}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              size="sm" 
              disabled={!activeNote}
              onClick={() => {
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 2000)
              }}
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            {activeNote && activeFolder && (
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteNote(activeFolder.id, activeNote.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          {activeNote ? (
            <NoteEditor 
              key={activeNote.id} 
              content={activeNote.content || ''} 
              onChange={handleContentChange} 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select or create a note to start writing.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
