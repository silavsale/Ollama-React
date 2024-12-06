import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "qwen2.5-coder:7b",
          prompt: prompt
        })
      });

      if (!res.ok) {
        // If the server returned an error code, handle it
        const errorText = await res.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      if (!res.body) {
        throw new Error('No response body received from server.');
      }

      const reader = res.body.getReader();
      setPrompt('')
      const decoder = new TextDecoder('utf-8');
      let partialText = '';
      let isDone = false; // to track if we've encountered a done object

      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) break; // No more data

        partialText += decoder.decode(value, { stream: true });
        let lines = partialText.split('\n');
        partialText = lines.pop() || ''; // Keep the last line if it's incomplete

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue; // skip empty lines

          try {
            const data = JSON.parse(trimmedLine);
            // Each line should be a JSON object with "response" and possibly "done"
            if (data.response !== undefined) {
              setResponse(r => r + data.response);
            }
            if (data.done) {
              isDone = true;
              break;
            }
          } catch (err) {
            console.error("Error parsing JSON line:", line, err);
            // If a line isn't valid JSON, show it as an error or skip
          }
        }
      }

    } catch (error) {
      console.error(error);
      setResponse('Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Qwen2.5-Coder:7b Interface</h1>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
        style={{ width: '100%', height: '100px', padding: '10px', fontSize: '16px' }}
      />
      <button
        onClick={handleGenerate}
        style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      <pre
        style={{
          marginTop: '20px',
          backgroundColor: '#f0f0f0',
          padding: '10px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        {response}
      </pre>
    </div>
  );
}

export default App;
