import { Firestore } from "@google-cloud/firestore"

async function predictHistories() {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');

  const prediction = await predictCollection.get();
  return prediction;
}

export default predictHistories;