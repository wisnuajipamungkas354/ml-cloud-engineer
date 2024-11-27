import tfjs from '@tensorflow/tfjs-node';

function loadModel() {
  const modelUrl = process.env.MODEL_URL;
  return tfjs.loadGraphModel(modelUrl);
}

export default loadModel;