"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { clientWithType } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FileUploadExample() {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    console.log(clientWithType.examples.upload.$url().href,'href')

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first')
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await fetch(clientWithType.examples.upload.$url().href, {
                method: 'POST',
                body: formData
            })
            const data = await response.json()

            alert('File uploaded successfully!')

            setFile(null)
            // Reset the input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
            if (fileInput) fileInput.value = ""
        } catch (error) {
            alert('Failed to upload file')
            console.error("Upload error:", error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>File Upload Example</CardTitle>
                    <CardDescription>Upload your files using this form</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file">File</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {file && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Selected file: {file.name}
                            </p>
                        )}
                        <Button
                            className="mt-4"
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
