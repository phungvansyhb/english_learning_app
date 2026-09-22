import { getSupabaseServer } from "@/utils/supabase/server"

export async function getListQuestionByTopic(topicId : string , diffLevel : number){
    const perPage = 10
    const from = (diffLevel - 1) * perPage
    const to = from + perPage - 1
    const supabase = await getSupabaseServer()
    const query = supabase.from('question_topics').select('*, questions(*)',{count : 'exact'})
    if(topicId !== 'all' && parseInt(topicId)){
      query.eq("topic_id", topicId);
    }
    query.order('question_id',{ascending : false})
    const {data , error, count} = await query.range(from , to)
    if (error) {
      console.error("Get list question error ", error);
      throw error
    }else {
        return data

    }
}