const ytSearch = require('yt-search');

async function run() {
  try {
    const results = await ytSearch('math tutorial');
    console.log('Results count:', results.videos.length);
    if (results.videos.length > 0) {
      console.log('First video:', results.videos[0].title);
    }
  } catch(e) {
    console.error('Error:', e);
  }
}
run();
