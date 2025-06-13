// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Upload, FileText, AlertCircle } from 'lucide-react'
// import { Input } from '../ui/input'

// export function FileUpload() {
//   const [dragActive, setDragActive] = useState(false)
//   const [file, setFile] = useState<File | null>(null)

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true)
//     } else if (e.type === 'dragleave') {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFile(e.dataTransfer.files[0])
//     }
//   }

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault()
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upload Portfolio</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div
//           className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
//             dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <Input
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             onChange={handleFileInput}
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           />
          
//           {file ? (
//             <div className="flex items-center justify-center flex-col">
//               <FileText className="h-12 w-12 text-green-500 mb-2" />
//               <p className="text-sm font-medium">{file.name}</p>
//               <p className="text-xs text-gray-500">Ready to upload</p>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center flex-col">
//               <Upload className="h-12 w-12 text-gray-400 mb-2" />
//               <p className="text-sm font-medium">Upload CSV or Excel file</p>
//               <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
//             </div>
//           )}
//         </div>
        
//         <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//           <div className="flex items-start">
//             <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
//             <div className="text-xs text-blue-700">
//               <p className="font-medium">Required columns:</p>
//               <p>Symbol, Quantity, BuyPrice</p>
//             </div>
//           </div>
//         </div>
        
//         {file && (
//           <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
//             Process File
//           </button>
//         )}
//       </CardContent>
//     </Card>
//   )
// }



// components/portfolio/file-upload.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Input } from '../ui/input'
import * as Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Import the PortfolioItem type from the main page
import type { PortfolioItem } from '@/app/portfolio/page'

// Type definitions for papaparse
interface ParseResult {
  data: any[]
  errors: any[]
  meta: any
}

interface FileUploadProps {
  onFileProcessed: (data: PortfolioItem[]) => void
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError(null)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const processCSV = (file: File): Promise<PortfolioItem[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: ParseResult) => {
          try {
            const data = results.data as any[]
            const processedData: PortfolioItem[] = data.map((row: any, index: number) => {
              // Handle different possible column names (case insensitive)
              const symbol = row.Symbol || row.symbol || row.SYMBOL || row.ticker || row.Ticker
              const quantity = row.Quantity || row.quantity || row.QUANTITY || row.shares || row.Shares
              const buyPrice = row.BuyPrice || row.buyPrice || row.BUYPRICE || row.price || row.Price || row.buy_price

              if (!symbol || quantity === undefined || buyPrice === undefined) {
                throw new Error(`Row ${index + 1}: Missing required fields (Symbol, Quantity, BuyPrice)`)
              }

              return {
                id: `${symbol}-${Date.now()}-${index}`,
                symbol: String(symbol).toUpperCase().trim(),
                quantity: Number(quantity),
                buyPrice: Number(buyPrice)
              }
            })
            resolve(processedData)
          } catch (error) {
            reject(error)
          }
        },
        error: (error: any) => reject(error)
      })
    })
  }

  const processExcel = (file: File): Promise<PortfolioItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          const processedData: PortfolioItem[] = jsonData.map((row: any, index: number) => {
            // Handle different possible column names (case insensitive)
            const symbol = row.Symbol || row.symbol || row.SYMBOL || row.ticker || row.Ticker
            const quantity = row.Quantity || row.quantity || row.QUANTITY || row.shares || row.Shares
            const buyPrice = row.BuyPrice || row.buyPrice || row.BUYPRICE || row.price || row.Price || row.buy_price

            if (!symbol || quantity === undefined || buyPrice === undefined) {
              throw new Error(`Row ${index + 1}: Missing required fields (Symbol, Quantity, BuyPrice)`)
            }

            return {
              id: `${symbol}-${Date.now()}-${index}`,
              symbol: String(symbol).toUpperCase().trim(),
              quantity: Number(quantity),
              buyPrice: Number(buyPrice)
            }
          })
          resolve(processedData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleProcessFile = async () => {
    if (!file) return

    setProcessing(true)
    setError(null)

    try {
      let data: PortfolioItem[]
      
      if (file.name.endsWith('.csv')) {
        data = await processCSV(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await processExcel(file)
      } else {
        throw new Error('Unsupported file format')
      }

      onFileProcessed(data)
      setFile(null) // Reset file after processing
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while processing the file')
    } finally {
      setProcessing(false)
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
              <p className="text-xs text-gray-500">Ready to process</p>
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
              <p className="mt-1 text-xs opacity-75">
                (Column names are case-insensitive. Alternative names like 'ticker', 'shares', 'price' are also supported)
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-red-700">
                <p className="font-medium">Error processing file:</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {file && (
          <button 
            onClick={handleProcessFile}
            disabled={processing}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Process File'}
          </button>
        )}
      </CardContent>
    </Card>
  )
}