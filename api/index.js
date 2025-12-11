import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/describe-image", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const uploadResponse = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "vision",
    });

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Give me a clean, descriptive prompt for this image." },
            {
              type: "image_url",
              image_url: { file_id: uploadResponse.id },
            },
          ],
        },
      ],
      max_tokens: 600,
    });

    fs.unlinkSync(filePath);

    const description = visionResponse.choices[0].message.content;
    res.json({ description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error describing image" });
  }
});

app.listen(port, () => {
  console.log(`LAILA backend running at http://localhost:${port}`);
});
