// let lastResponseId: string | null = null;
//Implementation detail: simple in-memory map to track conversation state
const conversations = new Map<string, string>(); //this should be replaced with a proper database in production

// Export public inteface

export const conversationRepository = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId);
  },
  setLastResponseId(conversationId: string, responseId: string) {
    conversations.set(conversationId, responseId);
  },
};
