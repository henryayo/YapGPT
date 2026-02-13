//OpenAI API wrapper

export async function sendPrompt(messages, apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    throw new ApiError('Please add your OpenAI API key in Settings.', 'auth');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const msg = data?.error?.message || `Request failed with status ${response.status}`;

    if (response.status === 401) {
      throw new ApiError('Invalid API key. Check your key in Settings.', 'auth');
    }
    if (response.status === 429) {
      throw new ApiError('Rate limit exceeded. Please wait a moment and try again.', 'rate_limit');
    }
    if (response.status >= 500) {
      throw new ApiError('OpenAI servers are experiencing issues. Try again later.', 'server');
    }
    throw new ApiError(msg, 'unknown');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export class ApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
  }
}