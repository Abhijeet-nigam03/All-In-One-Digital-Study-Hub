"use client"

import { useState, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { NoteEditor } from "@/components/notes/editor"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, File, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Mini3DIcon } from "@/components/3d/mini-3d-icon"

type PdfFile = {
  id: string
  file_name: string
  file_url: string
  file_size: number
  created_at: string
}

export default function FocusWorkspacePage() {
  const [noteContent, setNoteContent] = useState('<h1>Focus Mode</h1><p>Start taking notes while reading...</p>')
  
  useEffect(() => {
    const saved = localStorage.getItem('focus_notes')
    if (saved) setNoteContent(saved)
  }, [])

  const handleNoteChange = (content: string) => {
    setNoteContent(content)
    localStorage.setItem('focus_notes', content)
  }
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<PdfFile | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (isLibraryOpen && pdfs.length === 0) {
      fetchPdfs()
    }
  }, [isLibraryOpen])

  const fetchPdfs = async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPdfs(data)
    }
    setIsLoading(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] -m-4 lg:-m-6 border rounded-xl overflow-hidden bg-background">
      <div className="h-12 border-b flex items-center justify-between px-4 bg-muted/20">
        <h2 className="font-semibold text-sm">Focus Workspace</h2>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>
      
      {/* @ts-ignore */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-3rem)] w-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full flex-col bg-muted/10">
            <div className="h-10 border-b flex items-center px-4">
              <span className="text-xs font-medium text-muted-foreground">PDF Reader</span>
            </div>
            <div className={`flex-1 flex flex-col items-center justify-center border-2 ${selectedPdf ? 'border-transparent' : 'border-dashed border-muted m-4'} rounded-lg bg-card/50 relative overflow-hidden`}>
              {selectedPdf ? (
                <object
                  data={selectedPdf.file_url}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Your browser doesn't support embedded PDFs.</p>
                </object>
              ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none scale-150">
                    <Mini3DIcon type="box" color="#6366f1" />
                  </div>
                  <div className="text-center space-y-4 relative z-10">
                    <div className="flex justify-center mb-2">
                       <Mini3DIcon type="sphere" color="#6366f1" />
                    </div>
                    <p className="text-muted-foreground font-medium">Select a PDF from Library to read</p>
                    <Button variant="outline" size="sm" onClick={() => setIsLibraryOpen(true)}>Browse Library</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="h-10 border-b flex items-center px-4 justify-between">
              <span className="text-xs font-medium text-muted-foreground">Quick Notes</span>
              <span className="text-xs text-muted-foreground">Auto-saving...</span>
            </div>
            <div className="flex-1 p-2 overflow-hidden flex flex-col">
              <NoteEditor content={noteContent} onChange={handleNoteChange} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select PDF</DialogTitle>
          </DialogHeader>
          <div className="min-h-[300px] max-h-[60vh] overflow-y-auto pr-2 flex flex-col gap-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : pdfs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No PDFs found. Upload some in the Library page first.
              </div>
            ) : (
              pdfs.map(pdf => (
                <div 
                  key={pdf.id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPdf(pdf)
                    setIsLibraryOpen(false)
                  }}
                >
                  <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center shrink-0">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{pdf.file_name}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
