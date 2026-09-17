import { importStudyData } from '~/services/studyStorage'
import { supabase } from '~/services/supabaseClient'
import type { StudyData } from '~/types/study'

export interface CloudStudyData {
  data: StudyData
  updatedAt: string
}

export async function fetchCloudStudyData(userId: string): Promise<CloudStudyData | null> {
  if (!supabase)
    return null

  const { data, error } = await supabase
    .from('study_progress')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error)
    throw error
  if (!data)
    return null

  const imported = importStudyData(JSON.stringify(data.data))
  if (!imported.ok || !imported.data)
    throw new Error('云端学习数据格式无效，请联系管理员。')

  return {
    data: imported.data,
    updatedAt: imported.data.updatedAt || data.updated_at,
  }
}

export async function saveCloudStudyData(userId: string, studyData: StudyData) {
  if (!supabase)
    throw new Error('尚未配置云端同步。')

  const snapshot = JSON.parse(JSON.stringify(studyData)) as StudyData
  const { error } = await supabase
    .from('study_progress')
    .upsert({
      user_id: userId,
      data: snapshot,
      updated_at: snapshot.updatedAt,
    }, { onConflict: 'user_id' })

  if (error)
    throw error
}
