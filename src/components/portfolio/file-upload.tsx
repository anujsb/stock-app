'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Input } from '../ui/input'

export function FileUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="flex items-center justify-center flex-col">
              <FileText className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">Ready to upload</p>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Upload CSV or Excel file</p>
              <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Required columns:</p>
              <p>Symbol, Quantity, BuyPrice</p>
            </div>
          </div>
        </div>
        
        {file && (
          <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Process File
          </button>
        )}
      </CardContent>
    </Card>
  )
}
