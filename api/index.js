import express from 'express';
import { storage } from '../dist/storage.js';
import { getChatCompletion, generateProgramSummary } from '../dist/openai.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get all conversations
app.get("/api/conversations", async (_req, res) => {
  try {
    const conversations = await storage.getConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific conversation
app.get("/api/conversations/:id", async (req, res) => {
  try {
    const conversation = await storage.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "대화를 찾을 수 없습니다" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new conversation
app.post("/api/conversations", async (req, res) => {
  try {
    const conversation = await storage.createConversation(req.body);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a conversation
app.delete("/api/conversations/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteConversation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "대화를 찾을 수 없습니다" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
app.get("/api/messages", async (req, res) => {
  try {
    const conversationId = req.query.conversationId;
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId가 필요합니다" });
    }

    const messages = await storage.getMessages(conversationId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: "conversationId와 message가 필요합니다" });
    }

    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "대화를 찾을 수 없습니다" });
    }

    const userMessage = await storage.createMessage({
      conversationId,
      role: "user",
      content: message,
    });

    const history = await storage.getMessages(conversationId);
    const conversationMessages = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const aiResponse = await getChatCompletion(conversationMessages);

    const aiMessage = await storage.createMessage({
      conversationId,
      role: "assistant",
      content: aiResponse,
    });

    res.json({
      message: userMessage,
      reply: aiMessage,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "메시지 처리 중 오류가 발생했습니다" });
  }
});

// Generate program summary
app.post("/api/summary", async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId가 필요합니다" });
    }

    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "대화를 찾을 수 없습니다" });
    }

    const history = await storage.getMessages(conversationId);

    if (history.length === 0) {
      return res.status(400).json({ error: "대화 내용이 없습니다" });
    }

    const conversationMessages = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const summary = await generateProgramSummary(conversationMessages);

    res.json({ summary });
  } catch (error) {
    console.error("Summary generation error:", error);
    res.status(500).json({ error: error.message || "요약 생성 중 오류가 발생했습니다" });
  }
});

export default app;
