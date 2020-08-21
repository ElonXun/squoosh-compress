import * as browserPNG from "./browser-png/encoder";
import * as browserJPEG from "./browser-jpeg/encoder";
import * as browserWebP from "./browser-webp/encoder";
import { EncodeOptions as BrowserJPEGOptions } from "./browser-jpeg/encoder-meta";
import { EncodeOptions as BrowserWebpEncodeOptions } from "./browser-webp/encoder-meta";

function browserPngEncode(data: ImageData): Promise<Blob> {
  return browserPNG.encode(data);
}

function browserJpegEncode(
  data: ImageData,
  opts: BrowserJPEGOptions
): Promise<Blob> {
  return browserJPEG.encode(data, opts);
}

function browserWebpEncode(
  data: ImageData,
  opts: BrowserWebpEncodeOptions
): Promise<Blob> {
  return browserWebP.encode(data, opts);
}

export { browserPngEncode, browserJpegEncode, browserWebpEncode };
