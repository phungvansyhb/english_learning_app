export type ListeningPart = 'part-1' | 'part-2' | 'part-3' | 'part-4';
export type ListeningDifficulty = 'Dễ' | 'Trung bình' | 'Khó';

export type ListeningQuestion = {
  id: number;
  prompt: string;
  options: string[];
  answer: string;
};

export type ListeningLesson = {
  slug: string;
  part: ListeningPart;
  title: string;
  subtitle: string;
  difficulty: ListeningDifficulty;
  duration: number;
  questions: ListeningQuestion[];
  image?: string;
  transcript?: string;
};

export const listeningPartLabels: Record<ListeningPart, string> = {
  'part-1': 'Part 1 · Photographs',
  'part-2': 'Part 2 · Question–Response',
  'part-3': 'Part 3 · Conversations',
  'part-4': 'Part 4 · Talks',
};

export const listeningLessons: ListeningLesson[] = [
  { slug: 'office-photographs-01', part: 'part-1', title: 'Scenes around the office', subtitle: 'Nhận diện hành động và vị trí trong các bức ảnh văn phòng.', difficulty: 'Dễ', duration: 8, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80', questions: [{ id: 1, prompt: 'Look at the picture. What are the people doing?', options: ['They are arranging chairs.', 'They are boarding a train.', 'They are washing windows.', 'They are preparing a meal.'], answer: 'They are arranging chairs.' }, { id: 2, prompt: 'What is visible near the entrance?', options: ['A reception desk', 'A loading dock', 'A bicycle rack', 'A ticket machine'], answer: 'A reception desk.' }] },
  { slug: 'quick-responses-01', part: 'part-2', title: 'Everyday workplace responses', subtitle: 'Luyện nghe câu hỏi ngắn và chọn câu trả lời tự nhiên nhất.', difficulty: 'Dễ', duration: 10, questions: [{ id: 1, prompt: 'When will the report be ready?', options: ['By Friday afternoon.', 'At the front desk.', 'It was very helpful.', 'Yes, the red one.'], answer: 'By Friday afternoon.' }, { id: 2, prompt: 'Who reserved the conference room?', options: ['In the afternoon.', 'Mina from Sales did.', 'The room is upstairs.', 'For three hours.'], answer: 'Mina from Sales did.' }] },
  { slug: 'project-meeting-01', part: 'part-3', title: 'A change to the project meeting', subtitle: 'Theo dõi hội thoại giữa đồng nghiệp và bắt thông tin chi tiết.', difficulty: 'Trung bình', duration: 14, transcript: 'Woman: Have you heard from the design team yet?\nMan: Not yet. They asked to move our review to Thursday.\nWoman: Thursday works for me, but let’s send the updated agenda today.', questions: [{ id: 1, prompt: 'What are the speakers discussing?', options: ['A design review', 'A client invoice', 'A new office', 'A training course'], answer: 'A design review.' }, { id: 2, prompt: 'What does the woman suggest doing today?', options: ['Calling the client', 'Sending an agenda', 'Booking a flight', 'Printing the drawings'], answer: 'Sending an agenda.' }] },
  { slug: 'museum-announcement-01', part: 'part-4', title: 'Announcement at the city museum', subtitle: 'Nghe bài nói ngắn, kết hợp hình minh họa để trả lời câu hỏi.', difficulty: 'Khó', duration: 16, image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=80', transcript: 'Good morning, visitors. The west gallery will close at noon for a lighting upgrade. Please use the east entrance to access the special exhibition.', questions: [{ id: 1, prompt: 'What will happen at noon?', options: ['The west gallery will close.', 'The museum will open.', 'A guided tour will begin.', 'The café will move.'], answer: 'The west gallery will close.' }, { id: 2, prompt: 'Which entrance should visitors use?', options: ['The north entrance', 'The staff entrance', 'The east entrance', 'The underground entrance'], answer: 'The east entrance.' }] },
  { slug: 'airport-scenes-02', part: 'part-1', title: 'At the airport', subtitle: 'Ôn tập mô tả người, vật thể và hành động qua hình ảnh.', difficulty: 'Trung bình', duration: 9, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80', questions: [{ id: 1, prompt: 'What is the traveler holding?', options: ['A passport', 'A suitcase', 'A newspaper', 'A camera'], answer: 'A suitcase.' }] },
  { slug: 'team-planning-02', part: 'part-3', title: 'Planning the next sprint', subtitle: 'Hội thoại công việc với nhiều chi tiết và cách diễn đạt tương đương.', difficulty: 'Khó', duration: 15, questions: [{ id: 1, prompt: 'What will the team do first?', options: ['Review the timeline', 'Hire a designer', 'Move the launch', 'Call the vendor'], answer: 'Review the timeline.' }] },
];

export const listeningParts: Array<ListeningPart | 'all'> = ['all', 'part-1', 'part-2', 'part-3', 'part-4'];
export const listeningDifficulties: Array<ListeningDifficulty | 'all'> = ['all', 'Dễ', 'Trung bình', 'Khó'];

export function getListeningLesson(slug: string) { return listeningLessons.find((lesson) => lesson.slug === slug); }

export const audioSample = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73447.mp3?filename=corporate-office-ambient-11099.mp3';
