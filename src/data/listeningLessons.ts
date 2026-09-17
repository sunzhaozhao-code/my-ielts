import type { LearningStage, SkillAttempt } from '~/types/study'

export interface ListeningQuestion {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface ListeningLesson {
  id: string
  difficulty: 1 | 2 | 3
  title: string
  context: string
  transcript: string
  questions: ListeningQuestion[]
}

export const LISTENING_LESSONS: ListeningLesson[] = [
  {
    id: 'library-tour',
    difficulty: 1,
    title: 'Library Orientation',
    context: '场景：图书管理员介绍开放时间和借阅规则。',
    transcript: 'Welcome to Westfield Library. From Monday to Friday, we open at eight thirty in the morning and close at seven in the evening. On Saturdays, we close earlier, at four. New members may borrow up to six books for three weeks. If you need a quiet place to work, the study room is on the second floor, beside the computer room. Please book a desk at the front counter because places are limited.',
    questions: [
      { id: 'lt-1', prompt: 'What time does the library close on weekdays?', options: ['4:00 p.m.', '6:00 p.m.', '7:00 p.m.', '8:30 p.m.'], answer: 2, explanation: '工作日晚上七点关门。' },
      { id: 'lt-2', prompt: 'How long may new members keep books?', options: ['One week.', 'Two weeks.', 'Three weeks.', 'Six weeks.'], answer: 2, explanation: '录音说 for three weeks。' },
      { id: 'lt-3', prompt: 'Where should students book a desk?', options: ['Online.', 'At the front counter.', 'In the computer room.', 'On the second floor.'], answer: 1, explanation: '需要在前台预订座位。' },
    ],
  },
  {
    id: 'course-enrolment',
    difficulty: 1,
    title: 'Evening Course Enrolment',
    context: '场景：学员致电咨询晚间摄影课程。',
    transcript: 'The beginner photography course starts on the twelfth of October and runs for eight Tuesday evenings. Each class begins at six fifteen and lasts ninety minutes. The full course costs one hundred and twenty pounds, including printed notes, but students must bring their own camera. To reserve a place, complete the online form before the thirtieth of September. Payment is not required until your place has been confirmed by email.',
    questions: [
      { id: 'ce-1', prompt: 'On which day are the classes held?', options: ['Monday.', 'Tuesday.', 'Thursday.', 'Saturday.'], answer: 1, explanation: '课程连续八个星期二晚上进行。' },
      { id: 'ce-2', prompt: 'What must students provide themselves?', options: ['Printed notes.', 'A camera.', 'A laptop.', 'Studio lighting.'], answer: 1, explanation: '讲义包含在费用内，但相机需自备。' },
      { id: 'ce-3', prompt: 'When do students pay?', options: ['Before completing the form.', 'On 30 September.', 'After email confirmation.', 'At the final class.'], answer: 2, explanation: '收到邮件确认名额之后才付款。' },
    ],
  },
  {
    id: 'museum-research',
    difficulty: 2,
    title: 'Museum Visitor Research',
    context: '场景：两名学生讨论博物馆调研方案。',
    transcript: 'We originally planned to interview visitors as they entered the museum, but that would tell us more about their expectations than their actual experience. I think we should speak to them near the exit instead. We could ask them to complete a written questionnaire, although short face-to-face interviews may produce fuller answers. The museum manager has agreed to let us work on Friday afternoon, when attendance is usually moderate. Saturday would provide a larger sample, but the entrance area becomes too crowded for interviews.',
    questions: [
      { id: 'mr-1', prompt: 'Why do the students reject interviewing people at the entrance?', options: ['There is no space.', 'Visitors are in a hurry.', 'It measures expectations, not experience.', 'The manager refused permission.'], answer: 2, explanation: '入口采访更多反映预期，而非参观后的真实体验。' },
      { id: 'mr-2', prompt: 'Which method may give more detailed answers?', options: ['Online reviews.', 'Written questionnaires.', 'Face-to-face interviews.', 'Attendance records.'], answer: 2, explanation: '短面对面访谈可能得到更完整的回答。' },
      { id: 'mr-3', prompt: 'Why is Saturday unsuitable?', options: ['The museum is closed.', 'It is too crowded.', 'Too few people visit.', 'The manager is absent.'], answer: 1, explanation: '周六入口区域过于拥挤，不适合采访。' },
    ],
  },
  {
    id: 'wetland-fieldwork',
    difficulty: 2,
    title: 'Wetland Fieldwork Briefing',
    context: '场景：导师说明湿地实地考察安排。',
    transcript: 'Tomorrow we will survey the northern wetland. The coach leaves campus at seven forty-five, so please meet outside the science building by seven thirty. Waterproof boots are essential, but the department will provide measuring equipment and safety jackets. Your first task is to record water depth at ten marked points. After lunch, you will work in pairs to identify plant species. Do not collect samples unless your group leader gives permission, as several protected species grow in the area.',
    questions: [
      { id: 'wf-1', prompt: 'Where should students meet?', options: ['At the coach station.', 'Outside the science building.', 'At the northern wetland.', 'Beside the library.'], answer: 1, explanation: '集合地点是理科楼外。' },
      { id: 'wf-2', prompt: 'What must students bring?', options: ['Measuring equipment.', 'Safety jackets.', 'Waterproof boots.', 'Plant samples.'], answer: 2, explanation: '防水靴必须自备，其余设备由院系提供。' },
      { id: 'wf-3', prompt: 'What will students do after lunch?', options: ['Measure water depth.', 'Identify plants.', 'Return to campus.', 'Interview group leaders.'], answer: 1, explanation: '午饭后两人一组辨认植物。' },
    ],
  },
  {
    id: 'urban-heat',
    difficulty: 3,
    title: 'Reducing Urban Heat',
    context: '场景：讲座节选，讨论城市热岛缓解措施。',
    transcript: 'Cities are often warmer than surrounding rural areas because dark surfaces absorb solar energy and human activities release additional heat. Planting trees is widely recommended, yet the cooling effect varies with species, canopy size and access to water. Reflective roofs can reduce indoor temperatures more quickly, but their benefits are concentrated on individual buildings. Recent research therefore favours combining measures: trees along pedestrian routes, reflective materials on suitable roofs, and shaded public spaces. Crucially, planners must monitor who benefits, since wealthier districts often receive environmental improvements first.',
    questions: [
      { id: 'uh-1', prompt: 'Why are cities often warmer than rural areas?', options: ['They receive more sunlight.', 'Dark surfaces absorb energy and activities release heat.', 'They have fewer buildings.', 'Rural areas use reflective roofs.'], answer: 1, explanation: '录音给出深色表面吸热及人类活动放热两个原因。' },
      { id: 'uh-2', prompt: 'What limitation of reflective roofs is mentioned?', options: ['They require large trees.', 'They only work in winter.', 'Benefits focus on individual buildings.', 'They increase indoor temperatures.'], answer: 2, explanation: '反射屋顶的收益主要集中在单栋建筑。' },
      { id: 'uh-3', prompt: 'What do recent studies recommend?', options: ['Using one measure everywhere.', 'Removing pedestrian routes.', 'Combining several measures.', 'Improving wealthy districts first.'], answer: 2, explanation: '研究更支持组合多项措施。' },
    ],
  },
  {
    id: 'memory-retrieval',
    difficulty: 3,
    title: 'Retrieval Practice',
    context: '场景：教育心理学讲座节选。',
    transcript: 'Students commonly reread notes because the material feels increasingly familiar. Familiarity, however, can be mistaken for genuine learning. Retrieval practice takes a different approach: learners close the book and attempt to recall key ideas. This effort may feel less successful, but it strengthens access to the information later. Feedback remains important because an incorrect answer, if left uncorrected, can also become familiar. The most effective routine therefore combines spaced retrieval with prompt correction, rather than testing once at the end of a course.',
    questions: [
      { id: 'rp-1', prompt: 'Why can rereading be misleading?', options: ['Notes become shorter.', 'Familiarity may be confused with learning.', 'Students receive too much feedback.', 'It requires closing the book.'], answer: 1, explanation: '熟悉感容易被误认为真正掌握。' },
      { id: 'rp-2', prompt: 'What does retrieval practice require?', options: ['Copying every sentence.', 'Reading more quickly.', 'Recalling ideas without looking.', 'Testing only at the end.'], answer: 2, explanation: '核心是合上书后主动回忆。' },
      { id: 'rp-3', prompt: 'Why is feedback important?', options: ['It makes testing feel easier.', 'It prevents wrong answers becoming familiar.', 'It removes the need for repetition.', 'It replaces spaced practice.'], answer: 1, explanation: '错误若不及时纠正，也可能形成熟悉感。' },
    ],
  },
]

export function getListeningLesson(id: string | undefined) {
  return LISTENING_LESSONS.find(lesson => lesson.id === id)
}

export function selectListeningLesson(stage: LearningStage, attempts: SkillAttempt[], dayNumber: number) {
  const stageDifficulty: Record<LearningStage, 1 | 2 | 3> = { 'foundation': 1, 'ielts-5': 1, 'ielts-5.5': 2, 'ielts-6': 2, 'ielts-6.5': 3, 'ielts-7': 3 }
  let difficulty = stageDifficulty[stage]
  const recent = attempts.filter(attempt => attempt.type === 'listening' && attempt.resourceId.startsWith('listening:lesson:') && attempt.accuracy !== undefined).slice(-3)
  if (recent.length >= 3) {
    const average = recent.reduce((sum, attempt) => sum + (attempt.accuracy ?? 0), 0) / recent.length
    if (average < 60)
      difficulty = Math.max(1, difficulty - 1) as 1 | 2 | 3
    else if (recent.every(attempt => (attempt.accuracy ?? 0) >= 80))
      difficulty = Math.min(3, difficulty + 1) as 1 | 2 | 3
  }
  const candidates = LISTENING_LESSONS.filter(lesson => lesson.difficulty === difficulty)
  return candidates[(dayNumber - 1) % candidates.length]
}
