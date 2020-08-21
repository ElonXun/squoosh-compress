import { nativeDecode } from "./util";

export async function decodeImage(blob: Blob): Promise<ImageData> {
  try {
    // Otherwise, just throw it at the browser's decoder.
    return await nativeDecode(blob);
  } catch (err) {
    console.log("decodeImage err", err);
    throw Error("Couldn't decode image");
  }
}
