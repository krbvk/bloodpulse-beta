import * as tf from "@tensorflow/tfjs";

/**
 * Predict the next 12 months (or any number of months) from historical monthly data
 * @param values Historical monthly values
 * @param months Number of months to predict (default 12)
 */
export async function predictNext(values: number[], months = 12): Promise<number[]> {
  if (!values.length) return Array(months).fill(0);
  if (values.length === 1) return Array(months).fill(values[0]!);

  tf.engine().reset();

  // Normalize data
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const norm: number[] = values.map(v => (v - min) / range);

  // Prepare training data using sliding window
  const window = 3;
  const xsArr: number[][] = [];
  const ysArr: number[] = [];

  for (let i = 0; i <= norm.length - window - 1; i++) {
    xsArr.push(norm.slice(i, i + window));
    ysArr.push(norm[i + window]!);
  }

  const X = tf.tensor2d(xsArr);
  const Y = tf.tensor2d(ysArr, [ysArr.length, 1]);

  // Build simple dense model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [window], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  await model.fit(X, Y, { epochs: 200, verbose: 0 });

  const predictions: number[] = [];
  const history: number[] = [...norm];

  // Forecast each month one by one
  for (let i = 0; i < months; i++) {
    const lastWindowTensor = tf.tensor2d([history.slice(-window)]);
    const predTensor = model.predict(lastWindowTensor) as tf.Tensor<tf.Rank.R2>;

    // Convert tensor data safely to number[]
    const typedArray = await predTensor.data();
    const predArray: number[] = Array.from(typedArray, (v) => Number(v)); // <--- type-safe

    const predNorm = predArray[0] ?? 0;
    const pred = predNorm * range + min;
    predictions.push(Math.round(pred));

    history.push(predNorm);

    lastWindowTensor.dispose();
    predTensor.dispose();
  }

  X.dispose();
  Y.dispose();

  return predictions;
}
