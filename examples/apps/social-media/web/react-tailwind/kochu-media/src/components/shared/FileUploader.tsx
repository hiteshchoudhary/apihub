import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

interface FileUploaderProps {
  fieldChnage: (file: File) => void
  mediaUrl: string | null
}

const FileUploader = ({ fieldChnage, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFilesUrl] = useState(mediaUrl)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFile(acceptedFiles);
    fieldChnage(acceptedFiles[0])
    setFilesUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    }
  })


  return (
    <div
      {...getRootProps()}
      className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ? (
          <>
            <div className='flex flex-1 justify-center w-fit h-fit p-5 lg:p-10'>
              <img
                src={fileUrl}
                alt="iamge"
                className='file_uploader-img'
              />
            </div>
            <p className='file_uploader-label'>Click or drag photo to replace</p>
          </>
        ) : (
          <div className='file_uploader-box'>
            <img
              src="/assets/icons/file-upload.svg"
              alt='file-upload'
              width={100}
              height={100}
              className='' />
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag Photo Here</h3>
            <p className='text-light-4 small-regular mb-6'>PNG,JPG,SVG</p>
            <Button
              className='shad-button_dark_4'>
              Select file from device
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader