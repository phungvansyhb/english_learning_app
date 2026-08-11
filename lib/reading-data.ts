export type ReadingPart = 'part-5' | 'part-6' | 'part-7';
export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export type ReadingQuestion = {
  id: number;
  prompt: string;
  options?: string[];
  answer?: string;
  context?: string;
};

export type ReadingLesson = {
  slug: string;
  title: string;
  subtitle: string;
  part: ReadingPart;
  difficulty: Difficulty;
  duration: number;
  questions: ReadingQuestion[];
  passage?: string;
};

export const readingLessons: ReadingLesson[] = [
  { slug: 'office-supplies', title: 'Office supplies and orders', subtitle: 'Hoàn thành câu trong ngữ cảnh mua sắm văn phòng.', part: 'part-5', difficulty: 'Dễ', duration: 12, questions: [
    { id: 1, prompt: 'The purchasing department will place the order _____ all price details have been confirmed.', options: ['unless', 'once', 'despite', 'while'], answer: 'once' },
    { id: 2, prompt: 'Please make sure that every invoice is _____ before it is sent to accounting.', options: ['accurate', 'accurately', 'accuracy', 'accuracies'], answer: 'accurate' },
    { id: 3, prompt: 'The new printer is considerably _____ than the previous model.', options: ['efficient', 'more efficient', 'most efficient', 'efficiency'], answer: 'more efficient' },
  ] },
  { slug: 'travel-updates', title: 'Travel arrangements', subtitle: 'Luyện ngữ pháp và từ vựng qua email đặt chuyến công tác.', part: 'part-6', difficulty: 'Trung bình', duration: 15, questions: [
    { id: 1, prompt: 'Dear Ms. Lan, your flight reservation has been confirmed. We have also arranged a shuttle _____ the airport.', options: ['from', 'at', 'during', 'among'], answer: 'from' },
    { id: 2, prompt: 'Please review the attached itinerary and let us know _____ you need any changes.', options: ['if', 'so', 'than', 'because'], answer: 'if' },
    { id: 3, prompt: 'We look forward to _____ you at the conference next week.', options: ['meet', 'met', 'meeting', 'meets'], answer: 'meeting' },
  ], passage: 'To: Ms. Lan Nguyen\nSubject: Your Singapore conference itinerary\n\nDear Ms. Lan,\nYour flight reservation has been confirmed. The hotel is located within walking distance of the conference center. Please review the attached itinerary and let us know if you need any changes.\n\nBest regards,\nTravel Desk' },
  { slug: 'city-library', title: 'A new community library', subtitle: 'Đọc hiểu thông báo và tìm thông tin chi tiết.', part: 'part-7', difficulty: 'Khó', duration: 20, questions: [
    { id: 1, prompt: 'What is the main purpose of the notice?', options: ['To announce a library opening', 'To request volunteers', 'To advertise a book sale', 'To explain a parking policy'], answer: 'To announce a library opening' },
    { id: 2, prompt: 'When will the weekend workshops begin?', options: ['This Saturday', 'Next month', 'In the summer', 'After registration closes'], answer: 'Next month' },
    { id: 3, prompt: 'What can visitors do without a membership card?', options: ['Borrow books', 'Attend the opening event', 'Reserve a study room', 'Use the computers'], answer: 'Attend the opening event' },
  ], passage: 'RIVERSIDE COMMUNITY LIBRARY\n\nThe Riverside Community Library will open its doors on Saturday, May 18. Visitors are invited to join our opening celebration from 9:00 A.M. to 3:00 P.M.\n\nBeginning next month, the library will host free weekend workshops on digital skills and creative writing. A membership card is required to borrow materials and reserve study rooms, but all visitors may attend the opening event.\n\nFor more information, visit the welcome desk.' },
  { slug: 'project-deadlines', title: 'Project deadlines', subtitle: 'Củng cố cấu trúc câu thường gặp trong môi trường công sở.', part: 'part-5', difficulty: 'Khó', duration: 14, questions: [
    { id: 1, prompt: 'The revised proposal must be submitted _____ the client meeting on Friday.', options: ['prior to', 'between', 'although', 'whereas'], answer: 'prior to' },
    { id: 2, prompt: 'All team members are expected to respond _____ to urgent requests.', options: ['prompt', 'promptly', 'promptness', 'prompted'], answer: 'promptly' },
  ] },
  { slug: 'product-launch', title: 'Product launch announcement', subtitle: 'Hoàn thành email thông báo ra mắt sản phẩm mới.', part: 'part-6', difficulty: 'Dễ', duration: 13, questions: [
    { id: 1, prompt: 'Our newest software update will be available _____ Monday.', options: ['on', 'by', 'into', 'during'], answer: 'on' },
    { id: 2, prompt: 'Customers can download it directly from our website. _____, technical support will be available all week.', options: ['In addition', 'Instead', 'Otherwise', 'Meanwhile'], answer: 'In addition' },
  ], passage: 'To: All customers\nSubject: Introducing our newest update\n\nWe are pleased to announce that our newest software update will be available on Monday. The update includes a simplified dashboard and improved reporting tools. Customers can download it directly from our website.' },
  { slug: 'museum-exhibition', title: 'Museum exhibition guide', subtitle: 'Đọc thông tin triển lãm và suy luận ý chính.', part: 'part-7', difficulty: 'Trung bình', duration: 18, questions: [
    { id: 1, prompt: 'What is special about the exhibition?', options: ['It features local artists', 'It is open every night', 'It includes free meals', 'It travels internationally'], answer: 'It features local artists' },
    { id: 2, prompt: 'How can visitors receive a discount?', options: ['By arriving early', 'By showing a student card', 'By booking a tour', 'By visiting on Sunday'], answer: 'By showing a student card' },
  ], passage: 'THE ART OF OUR CITY\n\nThis summer, the Harbor Museum presents The Art of Our City, a special exhibition featuring works by twelve local artists. The exhibition is open Tuesday through Sunday from 10:00 A.M. to 6:00 P.M. Students who show a valid student card receive a 20 percent discount on admission.' },
];

export const partLabels: Record<ReadingPart, string> = { 'part-5': 'Part 5', 'part-6': 'Part 6', 'part-7': 'Part 7' };

export function getReadingLesson(slug: string) {
  return readingLessons.find((lesson) => lesson.slug === slug);
}

export function getPartDescription(part: ReadingPart) {
  return part === 'part-5' ? 'Incomplete sentences' : part === 'part-6' ? 'Text completion' : 'Reading comprehension';
}
