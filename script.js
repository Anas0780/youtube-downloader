let videoUrl = '';
let info = null;

async function analyze() {
  videoUrl = document.getElementById('url').value.trim();
  if (!videoUrl) return alert('الرجاء إدخال رابط');

  try {
    const res = await fetch('/analyze?url=' + encodeURIComponent(videoUrl));
    const data = await res.json();

    if (data.error) {
      alert('خطأ: ' + data.error);
      return;
    }

    info = data.info;
    document.getElementById('formatButtons').style.display = 'block';
  } catch (err) {
    alert('فشل في الاتصال: ' + err.message);
  }
}

function setFormat(fmt) {
  const div = document.getElementById('qualities');
  div.innerHTML = '<p>اختر الجودة:</p>';

  if (fmt === 'mp3') {
    const btn = document.createElement('button');
    btn.className = 'quality-btn';
    btn.textContent = 'تنزيل كـ MP3';
    btn.onclick = () => download('mp3', 'highestaudio');
    div.appendChild(btn);
  } else {
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    formats.slice(0, 5).forEach(f => {
      if (f.qualityLabel) {
        const btn = document.createElement('button');
        btn.className = 'quality-btn';
        btn.textContent = f.qualityLabel;
        btn.onclick = () => download('mp4', f.itag);
        div.appendChild(btn);
      }
    });
  }
}

function download(format, itag) {
  const params = new URLSearchParams({
    url: videoUrl,
    format: format,
    itag: itag
  });
  window.open(`/download?${params}`, '_blank');
}
