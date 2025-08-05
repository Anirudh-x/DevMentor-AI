// Import the functions you need from the SDKs you need
import { error } from "console";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB-7di8b_wCk4a4F-p0FGQWYu7Jw_5wFI",
  authDomain: "devmentor-ai-ed3a9.firebaseapp.com",
  projectId: "devmentor-ai-ed3a9",
  storageBucket: "devmentor-ai-ed3a9.firebasestorage.app",
  messagingSenderId: "1022062353637",
  appId: "1:1022062353637:web:ebbf0a4f2e61ba1b73080c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFiles(file: File, setProgress?: (progress: number) => void) {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', snapshot => {
        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (setProgress) setProgress(progress)
        switch (snapshot.state) {
          case 'paused':
            console.log('upload is paused');
            break;
          case 'running':
            console.log('upload is running');
            break;
        }
      }, error => {
        reject(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
          resolve(downloadUrl as string)
        })
      })

    } catch (error) {
      console.error(error);
      reject(error)
    }
  })
}