import type { TopicData, TopicContent, NoteTopicId } from '../types';

const STORAGE_KEY = 'atpl_topic_content_v1';

export const topicStorage = {
  load(): TopicData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { topics: [] };
      const parsed = JSON.parse(raw) as TopicData;
      if (!parsed.topics) return { topics: [] };
      return parsed;
    } catch {
      return { topics: [] };
    }
  },

  save(data: TopicData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getTopicContent(topicId: NoteTopicId): TopicContent | null {
    const data = this.load();
    return data.topics.find(t => t.topicId === topicId) || null;
  },

  saveTopicContent(content: TopicContent) {
    const data = this.load();
    const existingIndex = data.topics.findIndex(t => t.topicId === content.topicId);
    
    if (existingIndex >= 0) {
      data.topics[existingIndex] = content;
    } else {
      data.topics.push(content);
    }
    
    this.save(data);
  },

  addVideoToTopic(topicId: NoteTopicId, video: { title: string; youtubeId: string; description?: string }) {
    const data = this.load();
    let topic = data.topics.find(t => t.topicId === topicId);
    
    if (!topic) {
      topic = {
        topicId,
        theory: '',
        videos: [],
        practice: [],
        lastUpdated: new Date().toISOString()
      };
      data.topics.push(topic);
    }
    
    topic.videos.push({
      id: `${topicId}_video_${Date.now()}`,
      title: video.title,
      youtubeId: video.youtubeId,
      description: video.description
    });
    
    topic.lastUpdated = new Date().toISOString();
    this.save(data);
  },

  addPracticeToTopic(topicId: NoteTopicId, practice: { title: string; content: string; type: 'example' | 'exercise' | 'quiz' }) {
    const data = this.load();
    let topic = data.topics.find(t => t.topicId === topicId);
    
    if (!topic) {
      topic = {
        topicId,
        theory: '',
        videos: [],
        practice: [],
        lastUpdated: new Date().toISOString()
      };
      data.topics.push(topic);
    }
    
    topic.practice.push({
      id: `${topicId}_practice_${Date.now()}`,
      title: practice.title,
      content: practice.content,
      type: practice.type
    });
    
    topic.lastUpdated = new Date().toISOString();
    this.save(data);
  }
};