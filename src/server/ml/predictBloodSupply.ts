import * as tf from "@tensorflow/tfjs";

/**
 * Predict multiple months ahead from history
 * @param values historical data array
 * @param months number of months to predict
 */
export async function predictNext(values: number[], months: number): Promise<number[]> {
  if (!values.length) return Array(months).fill(0);
  if (values.length === 1) return Array(months).fill(values[0]!);

  tf.engine().reset();

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const norm = values.map(v => (v - min) / range);

  const window = 3;
  const xsArr: number[][] = [];
  const ysArr: number[] = [];

  for (let i = 0; i <= norm.length - window - 1; i++) {
    xsArr.push(norm.slice(i, i + window));
    ysArr.push(norm[i + window]!);
  }

  const X = tf.tensor2d(xsArr);
  const Y = tf.tensor2d(ysArr, [ysArr.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [window], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  await model.fit(X, Y, { epochs: 200, verbose: 0 });

  const history = [...norm];
  const predictions: number[] = [];

  for (let i = 0; i < months; i++) {
    const lastWindow = tf.tensor2d([history.slice(-window)]);
    const predTensor = model.predict(lastWindow) as tf.Tensor<tf.Rank.R2>;

    // Use `Array.from` on the TypedArray safely
    const predArray = Array.from(await predTensor.data()) as number[];
    const predNorm = predArray[0] ?? 0;

    const pred = predNorm * range + min;
    predictions.push(Math.round(pred));
    history.push(predNorm);

    lastWindow.dispose();
    predTensor.dispose();
  }

  X.dispose();
  Y.dispose();

  return predictions;
}

