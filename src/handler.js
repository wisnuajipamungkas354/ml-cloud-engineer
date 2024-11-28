import ClientError from '../exceptions/ClientError.js';
import predictClassification from './inference.js';
import crypto from 'crypto';
import storeData from './storeData.js';
import predictHistories from './histories.js';

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;
  
    const {confidenceScore, label, suggestion} = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "confidenceScore": confidenceScore,
      "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;

  } catch (err) {
    throw new ClientError("Terjadi kesalahan dalam melakukan prediksi", 400);
  }
}

async function getHistories(request, h) {

  const histories = await predictHistories();
  const formatData = [];

  histories.forEach((doc) => {
    const data = doc.data();
    formatData.push({
      id: doc.id,
      history: {
        id: doc.id,
        result: data.result,
        suggestion: data.suggestion,
        createdAt: data.createdAt,
      },
    });
  });

  const response = h.response({
    status: 'success',
    message: 'Get histories success!',
    data: formatData,
  });

  response.code(200);
  return response;
}

export {postPredictHandler, getHistories};