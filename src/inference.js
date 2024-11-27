import tf from '@tensorflow/tfjs-node';

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  const label = confidenceScore < 100 ? 'Non-cancer' : 'Cancer';

  let suggestion;

  if(label === 'Non-cancer') {
    suggestion = "Penyakit kanker tidak terdeteksi.";
  }

  if(label === 'Cancer') {
    suggestion = "Segera periksa ke dokter!";
  }

  return { confidenceScore, label, suggestion };
}

export default predictClassification;