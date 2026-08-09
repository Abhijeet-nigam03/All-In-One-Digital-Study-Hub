require('dotenv').config({ path: '.env.local' });
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    if(data.models) {
        console.log(data.models.map(m => m.name).filter(n => n.includes('gemini')));
    } else {
        console.log("Error:", data);
    }
  }).catch(e => console.error(e));
