const MAX_SIZE = 512 * 1024; // 512KB
const MAX_DIM = 256;

/** 将图片压缩为 data URL，便于存入 localStorage */
export async function processAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件（JPG、PNG、WebP）');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('图片不能超过 5MB');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const resized = await resizeImage(dataUrl, MAX_DIM);

  if (resized.length > MAX_SIZE * 1.37) {
    throw new Error('图片过大，请换一张更小的图片');
  }

  return resized;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl: string, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法处理图片'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('图片格式无效'));
    img.src = dataUrl;
  });
}
