import { decodeImage } from "./decoders";
import {
  browserPngEncode,
  browserJpegEncode,
  browserWebpEncode
} from "./processor";
import * as browserPNG from "./browser-png/encoder-meta";
import * as browserJPEG from "./browser-jpeg/encoder-meta";
import * as browserWebP from "./browser-webp/encoder-meta";

// Edge doesn't support `new File`, so here's a hacky alternative.
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9551546/
export class Fileish extends Blob {
  constructor(data: any[], public name: string, opts?: BlobPropertyBag) {
    super(data, opts);
  }
}

export const encoderMap = {
  [browserPNG.type]: browserPNG,
  [browserJPEG.type]: browserJPEG,
  [browserWebP.type]: browserWebP
};

export interface EncodeData {
  type: string;
  options: EncodeOptions;
}

export interface EncodeOptions {
  quality: number;
}


const compress = async (image: File | Fileish, encodeData: EncodeData, sourceFilename: string) => {
  console.log("fmn test compress", image, encodeData, sourceFilename);
  const decoded = await decodeImage(image);
  console.log("decoded", decoded);

  const compressedData = await (() => {
    switch (encodeData.type) {
      case browserPNG.type:
        return browserPngEncode(decoded);
      case browserJPEG.type:
        return browserJpegEncode(decoded, encodeData.options);
      case browserWebP.type:
        return browserWebpEncode(decoded, encodeData.options);
      // case browserGIF.type: return processor.browserGifEncode(decoded);
      // case browserTIFF.type: return processor.browserTiffEncode(decoded);
      // case browserJP2.type: return processor.browserJp2Encode(decoded);
      // case browserBMP.type: return processor.browserBmpEncode(decoded);
      // case browserPDF.type: return processor.browserPdfEncode(decoded);
      default:
        throw Error(`Unexpected encoder ${JSON.stringify(encodeData)}`);
    }
  })();

  const encoder = encoderMap[encodeData.type];

  return new Fileish(
    [compressedData],
    sourceFilename.replace(/.[^.]*$/, `.${encoder.extension}`),
    { type: encoder.mimeType }
  );
};

export default compress;
