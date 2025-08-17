const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

// خدمة الملفات من مجلد public
app.use(express.static('public'));

// تحليل الفيديو
app.get('/analyze', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.json({ error: 'رابط يوتيوب غير صالح' });
  }

  try {
    const info = await ytdl.getInfo(url);
    res.json({ success: true, info });
  } catch (err) {
    res.json({ error: 'فشل في التحليل: ' + err.message });
  }
});

// تنزيل الفيديو أو الصوت
app.get('/download', async (req, res) => {
  const url = req.query.url;
  const format = req.query.format;
  const itag = req.query.itag;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('رابط غير صالح');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'mp3') {
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
      ytdl(url, { quality: itag ? parseInt(itag) : 'highest' }).pipe(res);
    }
  } catch (err) {
    res.status(500).send('خطأ في التنزيل: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});