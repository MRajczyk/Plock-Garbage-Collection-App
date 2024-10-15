require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SMSAPI } = require("smsapi");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const VISION_API_KEY = process.env.VISION_API_KEY;

const TRANSLATE_API_KEY = process.env.TRANSLATE_API_KEY;
const translate = new Translate({ key: TRANSLATE_API_KEY });

const apiToken = process.env.TRANSLATE_API_KEY;
const smsapi = new SMSAPI(apiToken);

console.log(smsapi);

app.post("/send-sms", async (req, res) => {
  const { recipientPhoneNumber, message } = req.body;

  try {
    const result = await smsapi.sms.sendSms(recipientPhoneNumber, message);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd podczas wysyłania SMS." });
  }
});

const convertToBase64 = (file) => {
  return Buffer.from(file).toString("base64");
};

app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nie przesłano żadnego pliku." });
  }

  try {
    const imageBase64 = convertToBase64(req.file.buffer);

    const uri = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await axios.post(uri, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const labels = response.data.responses[0].labelAnnotations;

    res.json(
      labels.map((label) => ({
        description: label.description,
        score: label.score,
      }))
    );
  } catch (error) {
    console.error("Błąd podczas analizy obrazu:", error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas przetwarzania obrazu." });
  }
});

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    const [translation] = await translate.translate(text, target);
    res.json({ translatedText: translation });
  } catch (error) {
    console.error("Błąd podczas tłumaczenia:", error);
    res.status(500).json({ error: "Wystąpił błąd podczas tłumaczenia." });
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/gemini", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Brak danych wejściowych." });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    res.json(result.response.text());
    console.log(result.response.text());
  } catch (error) {
    console.error("Błąd podczas przetwarzania zapytania do Gemini API:", error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas przetwarzania zapytania." });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serwer działa na http://0.0.0.0:${port}`);
});
