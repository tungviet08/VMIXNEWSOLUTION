import { UserProfile, LookbookEntry } from '../types';

const STORAGE_KEY_CURRENT_USER = 'vietphuc_current_user';
const STORAGE_KEY_USERS_DB = 'vietphuc_users_db';
const STORAGE_KEY_USER_LOOKBOOKS = 'vietphuc_user_lookbooks';

const DEFAULT_USER: UserProfile = {
  id: 'user_genz_01',
  username: 'ancophong',
  displayName: 'An Cổ Phong',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Gen Z đam mê phục dựng và remix Việt phục triều Nguyễn & Kinh Bắc. Vừa gìn giữ hồn xưa vừa quậy cùng streetwear!',
  title: 'Gen Z Cổ Phong Stylist',
  joinedDate: 'Tháng 10, 2026',
  preferences: {
    favoriteEra: 'Triều Nguyễn (1802–1945)',
    preferredVibe: 'Remix đường phố',
    defaultAvatar: 'female',
    enableCulturalTips: true
  },
  savedLookbookIds: [],
  likedLookbookIds: []
};

export const userService = {
  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse current user from storage', e);
    }
    // Initialize default user
    this.saveCurrentUser(DEFAULT_USER);
    return DEFAULT_USER;
  },

  saveCurrentUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      // Also update in all users DB
      const users = this.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save current user', e);
    }
  },

  getAllUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load users DB', e);
    }
    return [DEFAULT_USER];
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates, preferences: { ...current.preferences, ...(updates.preferences || {}) } };
    this.saveCurrentUser(updated);
    return updated;
  },

  createAccount(username: string, displayName: string, bio: string): UserProfile {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username: username.toLowerCase().replace(/\s+/g, '_'),
      displayName: displayName || username,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      bio: bio || 'Người trẻ yêu mến tà áo truyền thống Việt Nam.',
      title: 'Tập sự Việt Phục',
      joinedDate: 'Hôm nay',
      preferences: {
        favoriteEra: 'Triều Nguyễn (1802–1945)',
        preferredVibe: 'Remix đường phố',
        defaultAvatar: 'female',
        enableCulturalTips: true
      },
      savedLookbookIds: [],
      likedLookbookIds: []
    };
    this.saveCurrentUser(newUser);
    return newUser;
  },

  login(username: string): UserProfile {
    const users = this.getAllUsers();
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      this.saveCurrentUser(found);
      return found;
    }
    // Auto register if not found
    return this.createAccount(username, username, '');
  },

  getUserLookbooks(userId?: string): LookbookEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER_LOOKBOOKS);
      if (stored) {
        const all: LookbookEntry[] = JSON.parse(stored);
        if (userId) return all.filter(l => l.authorId === userId);
        return all;
      }
    } catch (e) {
      console.warn('Failed to load user lookbooks', e);
    }
    return [];
  },

  saveUserLookbook(entry: LookbookEntry): LookbookEntry[] {
    const all = this.getUserLookbooks();
    const user = this.getCurrentUser();
    entry.authorId = user.id;
    entry.authorName = user.displayName;

    const existingIndex = all.findIndex(l => l.id === entry.id);
    if (existingIndex >= 0) {
      all[existingIndex] = entry;
    } else {
      all.unshift(entry);
    }

    try {
      localStorage.setItem(STORAGE_KEY_USER_LOOKBOOKS, JSON.stringify(all));
      if (!user.savedLookbookIds.includes(entry.id)) {
        user.savedLookbookIds.push(entry.id);
        this.saveCurrentUser(user);
      }
    } catch (e) {
      console.warn('Failed to save lookbook', e);
    }

    return all;
  },

  deleteUserLookbook(id: string): LookbookEntry[] {
    const all = this.getUserLookbooks();
    const filtered = all.filter(l => l.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_USER_LOOKBOOKS, JSON.stringify(filtered));
      const user = this.getCurrentUser();
      user.savedLookbookIds = user.savedLookbookIds.filter(lid => lid !== id);
      this.saveCurrentUser(user);
    } catch (e) {
      console.warn('Failed to delete lookbook', e);
    }
    return filtered;
  },

  toggleLike(lookbookId: string): { isLiked: boolean; newLikesCount: number } {
    const user = this.getCurrentUser();
    const isLiked = user.likedLookbookIds.includes(lookbookId);
    let newLikesCount = 0;

    if (isLiked) {
      user.likedLookbookIds = user.likedLookbookIds.filter(id => id !== lookbookId);
    } else {
      user.likedLookbookIds.push(lookbookId);
    }
    this.saveCurrentUser(user);

    return { isLiked: !isLiked, newLikesCount };
  }
};
