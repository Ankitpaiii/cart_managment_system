import * as faceapi from 'face-api.js';

export const loadModels = async () => {
    const MODEL_URL = '/models';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
};

export const getFaceDescriptor = async (video: HTMLVideoElement) => {
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) return null;
    return detection.descriptor;
};

export const compareFaces = (descriptor1: Float32Array, descriptor2: Float32Array) => {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    // Distance < 0.6 usually means match
    return distance < 0.6;
};
