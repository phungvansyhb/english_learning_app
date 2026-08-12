import { createClient } from '@supabase/supabase-js';
import topicData from './topics.json';
import vocabData from './vocabs.json';

const rawData = {
    "word": "obligate",
    "ipa": "UK: /ˈɒblɪɡeɪt/ | US: /ˈɑːblɪɡeɪt/",
    "meanings": [
        {
            "pos": "verb",
            "example": "Both parties are obligated to fulfill their contractual duties. (Cả hai bên bị bắt buộc phải thực hiện các nghĩa vụ hợp đồng.)",
            "meaning": "bắt buộc"
        }
    ],
    "phrases": [
        {
            "phrase": "obligate someone: bắt buộc ai đó"
        },
        {
            "phrase": "be obligated: bị bắt buộc"
        }
    ],
    "synonyms": [
        "require: yêu cầu"
    ],
    "difficulty_level": 1
}


async function demo() {
    const supabase = createClient(
        'https://tydekxcecnbylruwduyv.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGVreGNlY25ieWxydXdkdXl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ0Mjc1NCwiZXhwIjoyMDk4MDE4NzU0fQ.u9OCuTVrV1WXQGJxBsqAckIDb88r8lMLAQI4gAnOVpE'
    );
    const { data: newWordId, error } = await supabase.rpc('insert_vocab_data', {
        p_data: rawData
    });
    if (error) {
        console.error('Thêm dữ liệu thất bại, đã tự động rollback:', error.message);
    } else {
        console.log('Thêm thành công từ vựng mới : ', newWordId);
    }
}

demo()