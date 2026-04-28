import api from './api';

export interface ChatConversation {
  id: string;
  participantIds: string[];
  participantNames?: Record<string, string>;
  participantRoles?: Record<string, string>;
  valuationJobId?: string;
  lastMessage?: string;
  updatedAt: string;
  unreadBy?: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  valuationJobId?: string;
  createdAt: string;
}

interface StartConversationInput {
  userId: string;
  userName: string;
  userRole?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole?: string;
  valuationJobId?: string;
}

interface SendMessageInput {
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  valuationJobId?: string;
}

const LS_CONVERSATIONS = 'vdms_chat_conversations';
const LS_MESSAGES = 'vdms_chat_messages';

const nowIso = () => new Date().toISOString();
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readLocalConversations = (): ChatConversation[] =>
  readJson<ChatConversation[]>(LS_CONVERSATIONS, []);

const readLocalMessages = (): ChatMessage[] =>
  readJson<ChatMessage[]>(LS_MESSAGES, []);

const saveLocalConversations = (data: ChatConversation[]) => writeJson(LS_CONVERSATIONS, data);
const saveLocalMessages = (data: ChatMessage[]) => writeJson(LS_MESSAGES, data);

const sortByUpdated = (items: ChatConversation[]) =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

const hasBothUsers = (conv: ChatConversation, a: string, b: string) =>
  conv.participantIds.includes(a) && conv.participantIds.includes(b);

const localListConversations = (userId: string): ChatConversation[] => {
  const all = readLocalConversations();
  return sortByUpdated(all.filter((c) => c.participantIds.includes(userId)));
};

const localListMessages = (conversationId: string): ChatMessage[] => {
  const all = readLocalMessages();
  return all
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

const localStartConversation = (input: StartConversationInput): ChatConversation => {
  const conversations = readLocalConversations();

  const existing = conversations.find(
    (c) => hasBothUsers(c, input.userId, input.otherUserId) && c.valuationJobId === input.valuationJobId,
  );
  if (existing) {
    return existing;
  }

  const created: ChatConversation = {
    id: `conv-${uid()}`,
    participantIds: [input.userId, input.otherUserId],
    participantNames: {
      [input.userId]: input.userName,
      [input.otherUserId]: input.otherUserName,
    },
    participantRoles: {
      [input.userId]: input.userRole || 'user',
      [input.otherUserId]: input.otherUserRole || 'user',
    },
    valuationJobId: input.valuationJobId,
    lastMessage: '',
    updatedAt: nowIso(),
    unreadBy: {
      [input.userId]: 0,
      [input.otherUserId]: 0,
    },
  };

  conversations.push(created);
  saveLocalConversations(conversations);
  return created;
};

const localSendMessage = (input: SendMessageInput): ChatMessage => {
  const messages = readLocalMessages();
  const conversations = readLocalConversations();

  const message: ChatMessage = {
    id: `msg-${uid()}`,
    conversationId: input.conversationId,
    senderId: input.senderId,
    senderName: input.senderName,
    recipientId: input.recipientId,
    text: input.text,
    valuationJobId: input.valuationJobId,
    createdAt: nowIso(),
  };

  messages.push(message);

  const updatedConversations = conversations.map((c) => {
    if (c.id !== input.conversationId) return c;
    const unreadBy = { ...(c.unreadBy || {}) };
    unreadBy[input.recipientId] = (unreadBy[input.recipientId] || 0) + 1;
    unreadBy[input.senderId] = unreadBy[input.senderId] || 0;

    return {
      ...c,
      lastMessage: input.text,
      updatedAt: nowIso(),
      unreadBy,
    };
  });

  saveLocalMessages(messages);
  saveLocalConversations(updatedConversations);

  return message;
};

const localMarkConversationRead = (conversationId: string, userId: string): void => {
  const conversations = readLocalConversations();
  const updated = conversations.map((c) => {
    if (c.id !== conversationId) return c;
    return {
      ...c,
      unreadBy: {
        ...(c.unreadBy || {}),
        [userId]: 0,
      },
    };
  });
  saveLocalConversations(updated);
};

const normalizeConversation = (input: Partial<ChatConversation>): ChatConversation => ({
  id: input.id || `conv-${uid()}`,
  participantIds: input.participantIds || [],
  participantNames: input.participantNames || {},
  participantRoles: input.participantRoles || {},
  valuationJobId: input.valuationJobId,
  lastMessage: input.lastMessage || '',
  updatedAt: input.updatedAt || nowIso(),
  unreadBy: input.unreadBy || {},
});

const normalizeMessage = (input: Partial<ChatMessage>): ChatMessage => ({
  id: input.id || `msg-${uid()}`,
  conversationId: input.conversationId || '',
  senderId: input.senderId || '',
  senderName: input.senderName || 'Unknown',
  recipientId: input.recipientId || '',
  text: input.text || '',
  valuationJobId: input.valuationJobId,
  createdAt: input.createdAt || nowIso(),
});

export const messagingService = {
  listConversations: async (userId: string, role?: string): Promise<ChatConversation[]> => {
    try {
      const response = await api.get<ChatConversation[]>('/messages/conversations', {
        params: { userId, role },
      });
      return sortByUpdated(response.data.map(normalizeConversation));
    } catch {
      return localListConversations(userId);
    }
  },

  listMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get<ChatMessage[]>('/messages', {
        params: { conversationId },
      });
      return response.data
        .map(normalizeMessage)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return localListMessages(conversationId);
    }
  },

  startConversation: async (input: StartConversationInput): Promise<ChatConversation> => {
    try {
      const response = await api.post<ChatConversation>('/messages/conversations', input);
      return normalizeConversation(response.data);
    } catch {
      return localStartConversation(input);
    }
  },

  sendMessage: async (input: SendMessageInput): Promise<ChatMessage> => {
    try {
      const response = await api.post<ChatMessage>('/messages', input);
      return normalizeMessage(response.data);
    } catch {
      return localSendMessage(input);
    }
  },

  markConversationAsRead: async (conversationId: string, userId: string): Promise<void> => {
    try {
      await api.patch(`/messages/conversations/${conversationId}/read`, null, {
        params: { userId },
      });
    } catch {
      localMarkConversationRead(conversationId, userId);
    }
  },
};
