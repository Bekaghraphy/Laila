import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // تحميل المتغيرات البيئية

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ dest: 'uploads/' });

app.post('/describe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image in detail' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // حذف الصورة بعد الاستخدام (اختياري)
    fs.unlinkSync(imagePath);

    res.json({ description: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error describing image' });
  }
});

app.get('/', (req, res) => {
  res.send('Image description API is running.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});