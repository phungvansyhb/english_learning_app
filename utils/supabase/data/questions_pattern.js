const pattern = {
    "content": "What is he doing?",
    "audio_url": "https://tydekxcecnbylruwduyv.supabase.co/storage/v1/object/public/listen/E26-T01-01.mp3",  // if question has audio, file have to named E26_T01-<order_index>.mp3
    "image_url": "https://tydekxcecnbylruwduyv.supabase.co/storage/v1/object/public/media/E26-T01-01.jpg", // if question has image, file have to named E26_T01-<order_index>.jpg
    "image_url": "https://tydekxcecnbylruwduyv.supabase.co/storage/v1/object/public/media/E26-T01-01.jpg",
    "transcript": "Anh ấy đang làm gì?",
    "explanation": "",  // should be translated to Vietnamese
    "question_choices": [
        {
            "label": "A",
            "content": "He's looking at a mobile phone.",
            "is_correct": true,
            "transcript":"Anh ấy đang nhìn điện thoại"
        },
        {
            "label": "B",
            "content": "He's boarding a train.",
            "is_correct": false,
            "transcript": "Anh ấy đang lên tàu"
        },
        {
            "label": "C",
            "content": "He's putting on his glasses.",
            "is_correct": false,
            "transcript": "Anh ấy đang đeo kinh"
        },
        {
            "label": "D",
            "content": "He's placing his bag under a seat.",
            "is_correct": false,
            "transcript": "Anh ấy đang đặt chiếc túi trên ghế"
        }
    ],
    "order_index": "1",  // is index of question start from 1
    "answer_type": "ONE",
    "skill_id": "1", // 1 for listening , 2 for reading
    "exam_part_id": "1",  // 1 to 7
    "difficulty_id": "1",  // 1 : basic , 2: medium , 3 : advanced
    "test_id":"3",   // keep 3,
    "group_data" : [1,3], // 1 is first index of question and 3 is last
    "paraphrasing": ""  // optional
}