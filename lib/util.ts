export async function nativeDecode(blob: Blob): Promise<ImageData> {
  // Prefer createImageBitmap as it's the off-thread option for Firefox.
  const drawable =
    "createImageBitmap" in window
      ? await createImageBitmap(blob)
      : await blobToImg(blob);

  return drawableToImageData(drawable);
}

export async function blobToImg(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);

  try {
    return await decodeImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  const loaded = new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(Error("Image loading error"));
  });

  if (img.decode) {
    // Nice off-thread way supported in Safari/Chrome.
    // Safari throws on decode if the source is SVG.
    // https://bugs.webkit.org/show_bug.cgi?id=188347
    await img.decode().catch(() => null);
  }

  // Always await loaded, as we may have bailed due to the Safari bug above.
  await loaded;
  return img;
}

interface DrawableToImageDataOptions {
  width?: number;
  height?: number;
  sx?: number;
  sy?: number;
  sw?: number;
  sh?: number;
}
export function drawableToImageData(
  drawable: ImageBitmap | HTMLImageElement,
  opts: DrawableToImageDataOptions = {}
): ImageData {
  const {
    width = drawable.width,
    height = drawable.height,
    sx = 0,
    sy = 0,
    sw = drawable.width,
    sh = drawable.height
  } = opts;

  // Make canvas same size as image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  // Draw image onto canvas
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");
  ctx.drawImage(drawable, sx, sy, sw, sh, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

/**
 * Encode some image data in a given format using the browser's encoders
 *
 * @param {ImageData} data
 * @param {string} type A mime type, eg image/jpeg.
 * @param {number} [quality] Between 0-1.
 */
export async function canvasEncode(
  data: ImageData,
  type: string,
  quality?: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Canvas not initialized");
  ctx.putImageData(data, 0, 0);

  let blob: Blob | null;

  if ("toBlob" in canvas) {
    blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, type, quality)
    );
  } else {
    // Welcome to Edge.
    // TypeScript thinks `canvas` is 'never', so it needs casting.
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL(type, quality);
    const result = /data:([^;]+);base64,(.*)$/.exec(dataUrl);

    if (!result) throw Error("Data URL reading failed");

    const outputType = result[1];
    const binaryStr = atob(result[2]);
    const data = new Uint8Array(binaryStr.length);

    for (let i = 0; i < data.length; i += 1) {
      data[i] = binaryStr.charCodeAt(i);
    }

    blob = new Blob([data], { type: outputType });
  }

  if (!blob) throw Error("Encoding failed");
  return blob;
}

export function downloadImg(file: File, name: string) {
  const url = URL.createObjectURL(file);
  console.log("fmn test downloadImg url", url, name);
  let a = document.createElement("a");
  a.href = url;
  a.download = name;
  let e = document.createEvent("MouseEvents");
  e.initMouseEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
  URL.revokeObjectURL(url);
}
