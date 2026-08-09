"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, File, Search, LayoutGrid, List as ListIcon, Trash2, Loader2, Download, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

type PdfFile = {
  id: string
  file_name: string
  file_url: string
  file_size: number
  created_at: string
}

export default function LibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPdfs, setSelectedPdfs] = useState<PdfFile[]>([])

  const supabase = createClient()

  useEffect(() => {
    fetchPdfs()
  }, [])

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

    if (error) {
      alert("Failed to load PDFs")
      console.error(error)
    } else {
      setPdfs(data || [])
    }
    setIsLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("You must be logged in to upload files")
        return
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath)

      // Insert record into pdf_files table
      const { error: dbError } = await supabase
        .from('pdf_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
        })

      if (dbError) throw dbError

      alert("PDF uploaded successfully")
      fetchPdfs()
    } catch (error: any) {
      console.error('Error uploading file:', error)
      alert(error.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleDelete = async (e: React.MouseEvent, pdf: PdfFile) => {
    e.stopPropagation()
    
    if (!confirm("Are you sure you want to delete this PDF?")) return

    try {
      // Delete from storage
      const urlParts = pdf.file_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const filePath = `${user.id}/${fileName}`
        const { error: storageError } = await supabase.storage
          .from('pdfs')
          .remove([filePath])

        if (storageError) console.error("Storage delete error:", storageError)
      }

      // Delete from DB
      const { error: dbError } = await supabase
        .from('pdf_files')
        .delete()
        .eq('id', pdf.id)

      if (dbError) throw dbError

      alert("PDF deleted successfully")
      setPdfs(pdfs.filter(p => p.id !== pdf.id))
    } catch (error: any) {
      console.error('Error deleting file:', error)
      alert(error.message || "Failed to delete file")
    }
  }

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectPdf = (pdf: PdfFile) => {
    if (!selectedPdfs.find(p => p.id === pdf.id)) {
      setSelectedPdfs([...selectedPdfs, pdf])
    }
  }



  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pb-8 pr-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PDF Library</h1>
          <p className="text-muted-foreground">
            Manage and read your study materials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px] pl-8 bg-background"
            />
          </div>
          <div className="relative overflow-hidden inline-block">
            <Button disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {isUploading ? "Uploading..." : "Upload PDF"}
            </Button>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-default"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
          <Button 
            variant={view === "grid" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={view === "list" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setView("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20 border-dashed">
          <File className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No PDFs found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {searchQuery ? "No results match your search." : "Upload a PDF to get started with your digital library."}
          </p>
        </div>
      ) : (
        <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "flex flex-col gap-2"}>
          {filteredPdfs.map((pdf) => (
            <Card 
              key={pdf.id} 
              className={`group cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden ${view === "list" ? "flex flex-row items-center p-4" : ""}`}
              onClick={() => handleSelectPdf(pdf)}
            >
              {view === "grid" ? (
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-muted/30 border-b flex flex-col items-center justify-center relative">
                    <File className="h-16 w-16 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                    
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200">
                      <Button variant="secondary" size="sm" className="w-24">Open</Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-24"
                        onClick={(e) => handleDelete(e, pdf)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1" title={pdf.file_name}>{pdf.file_name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(pdf.file_size)}</span>
                      <span>{formatDistanceToNow(new Date(pdf.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{pdf.file_name}</h3>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(pdf.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">{formatFileSize(pdf.file_size)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDelete(e, pdf)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Open PDFs section */}
      {selectedPdfs.length > 0 && (
        <div className="mt-8 flex flex-col gap-6 border-t pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Open Documents ({selectedPdfs.length})</h2>
            <Button variant="outline" onClick={() => setSelectedPdfs([])}>
              Close All
            </Button>
          </div>
          
          {selectedPdfs.map((pdf) => (
            <div key={pdf.id} className="flex flex-col w-full h-[85vh] bg-muted/30 rounded-xl overflow-hidden border shadow-inner relative shrink-0">
               <div className="bg-background/80 p-2 flex justify-between items-center border-b absolute top-0 w-full z-10 backdrop-blur-md">
                 <span className="font-semibold text-sm pl-2 truncate max-w-[60%]">{pdf.file_name}</span>
                 <div className="flex gap-2">
                   <Button variant="ghost" size="sm" onClick={() => window.open(pdf.file_url, '_blank')} title="Open in new tab">
                     <ExternalLink className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => setSelectedPdfs(selectedPdfs.filter(p => p.id !== pdf.id))} title="Close PDF">
                     ✕
                   </Button>
                 </div>
               </div>
               <div className="pt-12 w-full h-full">
                 <object
                   data={pdf.file_url}
                   type="application/pdf"
                   className="w-full h-full"
                 >
                   <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                     <p>Your browser doesn't support embedded PDFs.</p>
                     <Button onClick={() => window.open(pdf.file_url, '_blank')}>
                       Download PDF
                     </Button>
                   </div>
                 </object>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
