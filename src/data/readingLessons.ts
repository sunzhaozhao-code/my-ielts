import type { LearningStage, SkillAttempt } from '~/types/study'

export interface ReadingQuestion {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface ReadingLesson {
  id: string
  difficulty: 1 | 2 | 3
  title: string
  passage: string
  questions: ReadingQuestion[]
}

export const READING_LESSONS: ReadingLesson[] = [
  {
    id: 'library-habits',
    difficulty: 1,
    title: 'A New Study Habit',
    passage: 'Leo used to study only before exams. He often felt tired and forgot what he had read. This term, he decided to study for thirty minutes every evening. He keeps his phone in another room and writes a short summary after each session. After six weeks, Leo still studies for the same amount of time, but he remembers more and feels less worried before tests.',
    questions: [
      { id: 'lh-1', prompt: 'What did Leo use to do?', options: ['Study every evening.', 'Study only before exams.', 'Write daily summaries.', 'Leave his phone at school.'], answer: 1, explanation: '第一句说明他过去只在考试前学习。' },
      { id: 'lh-2', prompt: 'Where does Leo put his phone?', options: ['On the desk.', 'In his bag.', 'In another room.', 'At school.'], answer: 2, explanation: '文章说 he keeps his phone in another room。' },
      { id: 'lh-3', prompt: 'What changed after six weeks?', options: ['He studies all night.', 'He remembers more.', 'He studies less often.', 'He stopped writing.'], answer: 1, explanation: '结尾说明他记得更多，也不再那么焦虑。' },
    ],
  },
  {
    id: 'city-bikes',
    difficulty: 1,
    title: 'City Bikes',
    passage: 'A small city introduced a bicycle-sharing programme last spring. Residents can unlock a bike with a mobile app and return it to any station. The first thirty minutes are free. The city expected young people to be the main users, but many older residents also joined because the bicycles made short journeys easier.',
    questions: [
      { id: 'cb-1', prompt: 'How do users unlock a bicycle?', options: ['With a key.', 'With a mobile app.', 'At the library.', 'By calling a driver.'], answer: 1, explanation: '文中直接说明使用 mobile app。' },
      { id: 'cb-2', prompt: 'How long can people ride for free?', options: ['Ten minutes.', 'Twenty minutes.', 'Thirty minutes.', 'One hour.'], answer: 2, explanation: 'The first thirty minutes are free。' },
      { id: 'cb-3', prompt: 'What surprised the city?', options: ['Bikes were too slow.', 'Stations were empty.', 'Older residents also joined.', 'Young people refused to join.'], answer: 2, explanation: 'but 后说明许多年长居民也参加了。' },
    ],
  },
  {
    id: 'sleep-memory',
    difficulty: 2,
    title: 'Sleep and Memory',
    passage: 'Researchers have long known that sleep supports memory. In one experiment, volunteers learned a list of unfamiliar words in the evening. Half of them slept normally, while the others stayed awake for most of the night. The next morning, the group that had slept remembered considerably more words. The researchers noted, however, that one good night of sleep cannot replace regular rest. Consistent sleep habits appear to be more valuable than occasional long sleep.',
    questions: [
      { id: 'sm-1', prompt: 'What did the volunteers learn?', options: ['A song.', 'Unfamiliar words.', 'Driving rules.', 'Mathematical formulas.'], answer: 1, explanation: '实验材料是一组不熟悉的单词。' },
      { id: 'sm-2', prompt: 'Which group remembered more?', options: ['The group that slept.', 'The group that stayed awake.', 'Both groups equally.', 'The article does not say.'], answer: 0, explanation: '正常睡眠组第二天记住了更多。' },
      { id: 'sm-3', prompt: 'What is the main qualification made by researchers?', options: ['Sleep never affects memory.', 'Only daytime sleep works.', 'One good night cannot replace regular sleep.', 'Long sleep is always harmful.'], answer: 2, explanation: 'however 后的内容是作者对结论的限定。' },
    ],
  },
  {
    id: 'urban-trees',
    difficulty: 2,
    title: 'Why Cities Need Trees',
    passage: 'Urban trees do more than improve the appearance of a street. Their leaves provide shade and release water vapour, which can reduce local temperatures during hot weather. Trees may also slow rainwater before it enters drainage systems. Yet planting is only the first step. Young trees need regular care, and species must be chosen for local conditions. A poorly selected tree may struggle to survive or damage nearby pavements as it grows.',
    questions: [
      { id: 'ut-1', prompt: 'How can trees reduce local temperatures?', options: ['By blocking drains.', 'Through shade and water vapour.', 'By damaging pavements.', 'Through artificial light.'], answer: 1, explanation: '文章列出 shade 和 release water vapour。' },
      { id: 'ut-2', prompt: 'What can trees do to rainwater?', options: ['Make it disappear.', 'Slow it before drainage systems.', 'Turn it into drinking water.', 'Prevent all floods.'], answer: 1, explanation: '文中说 may slow rainwater。' },
      { id: 'ut-3', prompt: 'Why is species selection important?', options: ['All trees grow at the same rate.', 'Some may not suit local conditions.', 'Residents dislike young trees.', 'It reduces the number of streets.'], answer: 1, explanation: '不适合当地条件的树可能难以存活或破坏路面。' },
    ],
  },
  {
    id: 'citizen-science',
    difficulty: 3,
    title: 'The Value of Citizen Science',
    passage: 'Scientific projects increasingly invite members of the public to collect observations. Participants may photograph insects, measure rainfall or classify images online. Critics argue that data gathered by volunteers can be inconsistent, particularly when a task requires specialist judgement. Supporters respond that training and repeated observations can reduce such errors. More importantly, a large network of volunteers can cover places and periods that a small research team could never monitor. Citizen science is therefore most effective when projects match the complexity of the task to the experience of participants and include clear methods for checking data quality.',
    questions: [
      { id: 'cs-1', prompt: 'What concern do critics raise?', options: ['Projects are always expensive.', 'Volunteer data may be inconsistent.', 'Scientists refuse to use photographs.', 'Rainfall cannot be measured.'], answer: 1, explanation: '批评者担心志愿者收集的数据不一致。' },
      { id: 'cs-2', prompt: 'What advantage can a large volunteer network provide?', options: ['It removes all errors.', 'It replaces every scientist.', 'It covers more places and periods.', 'It requires no training.'], answer: 2, explanation: '志愿者网络可以覆盖小团队无法监测的时间和地点。' },
      { id: 'cs-3', prompt: 'According to the passage, when is citizen science most effective?', options: ['When tasks are never checked.', 'When task complexity matches participant experience.', 'When only specialists participate.', 'When projects avoid clear methods.'], answer: 1, explanation: '结尾给出了有效项目的关键条件。' },
    ],
  },
  {
    id: 'remote-work',
    difficulty: 3,
    title: 'Rethinking Remote Work',
    passage: 'Early discussions of remote work often treated it as a simple choice between home and office. Recent studies suggest a more complicated picture. Employees may value quiet time at home for concentrated tasks while preferring the office for rapid discussion and informal learning. The benefits also depend on housing, commuting distance and the quality of digital tools. Consequently, a policy that is successful in one organisation may fail in another. Rather than copying a fixed schedule, managers are advised to examine which activities require physical presence and to evaluate arrangements over time.',
    questions: [
      { id: 'rw-1', prompt: 'What did early discussions assume?', options: ['Remote work was a simple home-or-office choice.', 'All work required travel.', 'Digital tools were unnecessary.', 'Housing never affected work.'], answer: 0, explanation: '第一句指出早期讨论将其视为简单的二选一。' },
      { id: 'rw-2', prompt: 'Why might employees prefer the office?', options: ['For longer commutes.', 'For concentrated solo tasks only.', 'For rapid discussion and informal learning.', 'Because home is always unsuitable.'], answer: 2, explanation: '文章明确列出讨论和非正式学习。' },
      { id: 'rw-3', prompt: 'What are managers advised to do?', options: ['Copy another company’s schedule.', 'Require everyone to stay home.', 'Avoid evaluating policies.', 'Match arrangements to activities and review them.'], answer: 3, explanation: '结尾建议根据活动需要制定并持续评估。' },
    ],
  },
]

export function getReadingLesson(id: string | undefined) {
  return READING_LESSONS.find(lesson => lesson.id === id)
}

export function selectReadingLesson(stage: LearningStage, attempts: SkillAttempt[], dayNumber: number) {
  const stageDifficulty: Record<LearningStage, 1 | 2 | 3> = { 'foundation': 1, 'ielts-5': 1, 'ielts-5.5': 2, 'ielts-6': 2, 'ielts-6.5': 3, 'ielts-7': 3 }
  let difficulty = stageDifficulty[stage]
  const recent = attempts.filter(attempt => attempt.type === 'reading' && attempt.accuracy !== undefined).slice(-3)
  if (recent.length >= 3) {
    const average = recent.reduce((sum, attempt) => sum + (attempt.accuracy ?? 0), 0) / recent.length
    if (average < 60)
      difficulty = Math.max(1, difficulty - 1) as 1 | 2 | 3
    else if (recent.every(attempt => (attempt.accuracy ?? 0) >= 80))
      difficulty = Math.min(3, difficulty + 1) as 1 | 2 | 3
  }
  const candidates = READING_LESSONS.filter(lesson => lesson.difficulty === difficulty)
  return candidates[(dayNumber - 1) % candidates.length]
}
