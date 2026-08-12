export type TestPart = 'part-1' | 'part-2' | 'part-3' | 'part-4' | 'part-5' | 'part-6' | 'part-7';
export type TestMode = 'quick' | 'full';
export const testParts: { id: TestPart; label: string; skill: string; questions: number }[] = [
  { id: 'part-1', label: 'Part 1', skill: 'Photographs', questions: 6 },
  { id: 'part-2', label: 'Part 2', skill: 'Question–Response', questions: 25 },
  { id: 'part-3', label: 'Part 3', skill: 'Conversations', questions: 39 },
  { id: 'part-4', label: 'Part 4', skill: 'Talks', questions: 30 },
  { id: 'part-5', label: 'Part 5', skill: 'Incomplete Sentences', questions: 30 },
  { id: 'part-6', label: 'Part 6', skill: 'Text Completion', questions: 16 },
  { id: 'part-7', label: 'Part 7', skill: 'Reading Comprehension', questions: 54 },
];
export const tests = [
  { slug: 'toeic-diagnostic-01', title: 'TOEIC Diagnostic Test 01', subtitle: 'Bài kiểm tra tổng hợp giúp bạn xác định điểm xuất phát.', difficulty: 'Trung bình', duration: 120, questions: 200, completed: 42, accent: 'Full test' },
  { slug: 'toeic-listening-focus', title: 'Listening Focus Test', subtitle: 'Tập trung toàn bộ vào kỹ năng nghe với nhịp độ gần đề thật.', difficulty: 'Dễ', duration: 45, questions: 50, completed: 68, accent: 'Listening' },
  { slug: 'toeic-reading-focus', title: 'Reading Focus Test', subtitle: 'Luyện Part 5–7 với các câu hỏi chọn lọc theo độ khó.', difficulty: 'Khó', duration: 60, questions: 60, completed: 24, accent: 'Reading' },
];
export const attempts = [
  { title: 'TOEIC Diagnostic Test 01', date: '12/08/2026', score: '785', correct: '156/200', duration: '98 phút', status: 'Đã hoàn thành' },
  { title: 'Listening Focus Test', date: '08/08/2026', score: '360', correct: '42/50', duration: '41 phút', status: 'Đã hoàn thành' },
  { title: 'Reading Focus Test', date: '03/08/2026', score: 'Đang dở', correct: '32/60', duration: '28 phút', status: 'Có thể tiếp tục' },
];
export const testQuestions = [
  { id: 1, part: 'Part 2', prompt: 'When will the new office chairs arrive?', options: ['They are more comfortable.', 'By the end of the week.', 'The office is on the third floor.', 'I ordered them yesterday.'], answer: 1 },
  { id: 2, part: 'Part 5', prompt: 'Please submit the revised proposal _____ Friday afternoon.', options: ['at', 'in', 'by', 'since'], answer: 2 },
  { id: 3, part: 'Part 3', prompt: 'What does the woman suggest doing first?', options: ['Calling the supplier', 'Checking the inventory', 'Rescheduling the meeting', 'Printing the report'], answer: 1 },
  { id: 4, part: 'Part 7', prompt: 'According to the notice, what has changed?', options: ['The opening hours', 'The membership fee', 'The parking location', 'The reservation policy'], answer: 0 },
];
export type TestConfig = { parts: TestPart[]; mode: TestMode; minutes: number; questionLimit: number };
export const defaultTestConfig: TestConfig = { parts: testParts.map((part) => part.id), mode: 'quick', minutes: 30, questionLimit: 30 };
export const testPartLabel = Object.fromEntries(testParts.map((part) => [part.id, part.label])) as Record<TestPart, string>;
export const getTest = (slug: string) => tests.find((test) => test.slug === slug) ?? tests[0];
