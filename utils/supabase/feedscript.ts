import { createClient } from '@supabase/supabase-js';
import vocabData from './data/vocab/vocabs.json';
import questionData from './data/EST_2026_T1/questions.json'

function createSupabase() {
    const supabase = createClient(
        'https://tydekxcecnbylruwduyv.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGVreGNlY25ieWxydXdkdXl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ0Mjc1NCwiZXhwIjoyMDk4MDE4NzU0fQ.u9OCuTVrV1WXQGJxBsqAckIDb88r8lMLAQI4gAnOVpE',
    );
    return supabase
}

async function bulkInsertVocab() {
    const supabase = createSupabase()
    for (let i = 0; i < vocabData.length; i++) {
        const { error } = await supabase.rpc('insert_vocab_data', {
            p_data: vocabData[i],
        });
        if (error) {
            console.error('Thêm word số:', i, 'thất bại, đã tự động rollback:', error.message);
        } else {
            console.log('Thêm thành công từ vựng mới : ', vocabData[i].word);
        }
    }
}

async function bulkInsertQuestion(){
    const supabase = createSupabase();
    const [inserted , ...rest] = questionData;
    for(let i = 0 ; i < rest.length ; i++){
        const { data, error } = await supabase.rpc("insert_question_to_test", { p_data: rest[i] })
        if (error) {
            console.error('Thêm question fail:', error.message);
        } else {
            console.log('Thêm question thanh công :', data);
        }
    }
   
}


(function main(){
    bulkInsertQuestion()
})()


// run cmd: tsx feedscript.ts