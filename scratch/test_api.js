

async function test() {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "hello! What is 2 + 2?" }]
    })
  });
  
  if (!res.ok) {
    console.error("Error status:", res.status);
    const text = await res.text();
    console.error("Error text:", text);
    return;
  }
  
  // Try to stream the response
  const reader = res.body;
  if (!reader) {
    console.log("No body returned");
    return;
  }
  
  console.log("Response headers:", res.headers);
  console.log("Streaming response...");
  
  try {
    for await (const chunk of res.body) {
      process.stdout.write(chunk.toString());
    }
  } catch (err) {
    console.error(err);
  }
  
  console.log("\\nDone");
}

test();
