import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/prompts.txt';

// impmementation detail
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
  'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

interface ChatResponse {
  id: string;
  message: string;
}

// public interface
// leaky abstraction - exposing OpenAI response object directly - fixed with ChatResponse interface
export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions,
      input: prompt,
      temperature: 0.2, // less creative
      max_output_tokens: 200, // limit response length
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId), // maintain context if available
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
