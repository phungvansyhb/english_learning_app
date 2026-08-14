import { createClient } from '@supabase/supabase-js';
import topicData from './topics.json';
import vocabData from './vocabs.json';
import * as fs from 'fs';
import * as path from 'path';

async function bulkInsert() {
	const supabase = createClient(
		'https://tydekxcecnbylruwduyv.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGVreGNlY25ieWxydXdkdXl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ0Mjc1NCwiZXhwIjoyMDk4MDE4NzU0fQ.u9OCuTVrV1WXQGJxBsqAckIDb88r8lMLAQI4gAnOVpE',
	);
    for(let i = 0 ; i < vocabData.length;  i++){
        const { error } = await supabase.rpc('insert_vocab_data', {
            p_data: vocabData[i],
        });
        if (error) {
            console.error('Thêm word số:', i , 'thất bại, đã tự động rollback:', error.message);
        } else {
            console.log('Thêm thành công từ vựng mới : ', vocabData[i].word);
        }
    }
	
}

bulkInsert();
