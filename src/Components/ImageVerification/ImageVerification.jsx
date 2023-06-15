import { Modal } from '@mantine/core'
import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { account } from '../../Services/Appwrite/AppwriteConfig';
import { getUserByEmail } from '../../Services/Database/UserCollection';
import * as faceapi from 'face-api.js';

// import { loadImage } from 'face-api.js';
const ImageVerification = ({open , close , setLock}) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
      faceMyDetect();
    };

    loadModels();
  }, []);

  const loadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = URL.createObjectURL(blob);
    });
  };

  const faceMyDetect = ()=>{
    setInterval(async()=>{
      const user = await account.get()
      const userFromDb = await getUserByEmail(user.email)
      const faceId = userFromDb.documents[0].ImageId
      const usersBucketId = import.meta.env.VITE_USERS_BUCKET_ID
      const projectId = '6481f641e4ce0ba7f339'
      const detections = await faceapi
      .detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const referenceImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/648a6d5de3096e411f8a/files/648a73c99739a0efb7b4/view?project=6481f641e4ce0ba7f339&mode=admin`
    const referenceImage = await loadImage(referenceImageUrl);
    const referenceDetection = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor();

    if (detections.length > 0 && referenceDetection) {
      const faceMatcher = new faceapi.FaceMatcher([referenceDetection.descriptor]);
      const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
      const isMatch = bestMatch.label === 'unknown';

      console.log('Face Match:', isMatch);
      // Set the lock state based on the face match result
      setLock(!isMatch);
    }
    },10000)
  }


  return (
    <Modal opened={open}  onClose={close} title="Verify Face to Unlock" centered>
         <Webcam ref={webcamRef} />
    </Modal>
  )
}

export default ImageVerification