import { ChatSettings, Message } from '../types';

export const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most advanced model, best for complex tasks' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Faster and more affordable' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance with large context' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
];

export async function sendMessageToOpenAI(
  messages: Message[],
  settings: ChatSettings,
  onChunk?: (chunk: string) => void
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        ...(settings.systemPrompt ? [{ role: 'system', content: settings.systemPrompt }] : []),
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      stream: !!onChunk,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to send message');
  }

  if (onChunk) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    }
    return fullResponse;
  } else {
    const data = await response.json();
    return data.choices[0].message.content;
  }
}