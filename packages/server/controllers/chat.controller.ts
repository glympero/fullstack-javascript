import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// implementation detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.string().uuid(),
});

// public interface
export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.format() });
    }

    try {
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ response: response.message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate a response' });
    }
  },
};
