import { Button, Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";
import { dataURLtoFile } from './ImageConversion';
import { getUserByEmail, uploadImageToBucket } from '../../../Services/Database/UserCollection';

const ImageUpload = ({isImageUploaded , email}) => {
  const [loading , setLoading] = useState(false)
  const [open , setOpen] = useState(false)
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    async() => {
      setLoading(true)
      const userFromDb = await getUserByEmail(email)
      const imageSrc = webcamRef.current.getScreenshot();
      const file = dataURLtoFile(imageSrc, `${user.email}`);
      await uploadImageToBucket(userFromDb.documents[0] , file)
      setLoading(false)
      close()
    },
    [webcamRef]
  );

  useEffect(() => {
    if(!isImageUploaded){
      setOpen(true)
    }
  }, [isImageUploaded])
  

  const close = async()=>{
    const userFromDb = await getUserByEmail(email)
    if(userFromDb.documents[0].isImageUploaded === true){
      setOpen(false)
    }else{
      null
    }
  }
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  return (
       <Modal opened={open}  onClose={close} title="Capture Face For Auth" centered>
        <div>
            <Webcam 
            audio={false}
            ref={webcamRef}
            width='360px'
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            />
            <Button loading={loading} onClick={capture}>{loading ? "Capturing" : "Capture"}</Button>
        </div>
      </Modal>
  )
}

export default ImageUpload