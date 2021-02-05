import { ThunkAction } from 'redux-thunk';

import { GET_IMAGES, ADD_IMAGE, DELETE_IMAGE, GalleryAction, GalleryImage, User } from '../types';
import { RootState } from '..';
import firebase from '../../firebase/config';

// Add/upload image
//!This action will have 3 parameters, list of files, user and onProgress function. For each file we will create uploadTask and while uploading we’ll show the progress bar so we will call onProgress function and pass progress and file to get this data inside component. And when the file is uploaded to firebase storage we will get the file download url and save the file to gallery collection, and the we will dispatch ADD_IMAGE action to add the image/file to images array in our gallery state.If error occurs we will just console log the error, but you can create notification component and show the error on screen.

export const addImage = (files: FileList, user: User, onProgress: (num: number, file: File) => void): ThunkAction<void, RootState, null, GalleryAction> => {
  return async dispatch => {
    Array.from(files).forEach(async (file: File) => {
      const filePath = `images/${user.id}/${new Date().getTime()}-${file.name}`;
      const storageRef = firebase.storage().ref(filePath);
      const uploadTask = storageRef.put(file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress, file);
      }, (error) => {
        console.log(error);
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadUrl) => {
          try {
            const data: GalleryImage = {
              imageUrl: downloadUrl,
              fileName: file.name,
              filePath: filePath,
              uploaderName: user.firstName,
              uploaderId: user.id,
              createdAt: new Date().getTime()
            }
            const ref = await firebase.firestore().collection('gallery').add(data);
            data.id = ref.id;
            dispatch({
              type: ADD_IMAGE,
              payload: data
            });
          } catch (err) {
            console.log(err);
          }
        }).catch(err => console.log(err));
      });
    });
  }
}

// Get images
//!Second action is called getImages. In this one we will get all documents from gallery collection and we’ll add them to array and we’ll also add id to each object and then we can dispatch GET_IMAGES action to save the array in images in gallery state.
export const getImages = (): ThunkAction<void, RootState, null, GalleryAction> => {
  return async dispatch => {
    try {
      const docs = await firebase.firestore().collection('gallery').get();
      const arr: GalleryImage[] = [];
      docs.forEach(doc => {
        const { createdAt, fileName, filePath, imageUrl, uploaderName, uploaderId } = doc.data();
        arr.push({ createdAt, fileName, filePath, imageUrl, uploaderName, uploaderId, id: doc.id });
      });
      dispatch({
        type: GET_IMAGES,
        payload: arr
      });
    } catch (err) {
      console.log(err);
    }
  }
}

// Delete image
//!And the last gallery action is deleteImage. This action has 2 parameters, image which we need to delete and onSuccess function which will be called when image is deleted. So in this action we need to delete image from firebase storage and corresponding document from gallery collection. After that we can dispatch DELETE_IMAGE action and delete deleted images from images array.
export const deleteImage = (image: GalleryImage, onSuccess: () => void): ThunkAction<void, RootState, null, GalleryAction> => {
  return async dispatch => {
    try {
      const imageRef = firebase.storage().ref().child(image.filePath);
      await imageRef.delete();
      await firebase.firestore().collection('gallery').doc(image.id).delete();
      dispatch({
        type: DELETE_IMAGE,
        payload: image
      });
      onSuccess();
    } catch (err) {
      console.log(err);
    }
  }
}