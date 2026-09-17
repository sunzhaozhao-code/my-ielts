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
  {
    id: 'bus-service-change',
    difficulty: 1,
    title: 'Bus Service Update',
    context: '场景：公交公司发布临时线路调整通知。',
    transcript: 'From next Monday, buses on route sixteen will not stop outside Central Market because of road repairs. Passengers should use the temporary stop on King Street, opposite the post office. Services will continue every twenty minutes during the day, but the final evening bus will leave the railway station at ten fifteen instead of ten forty-five. The road work is expected to last for three weeks. Updated timetables are available on the company website and inside the railway station.',
    questions: [
      { id: 'bs-1', prompt: 'Where is the temporary bus stop?', options: ['Beside Central Market.', 'Opposite the post office.', 'Inside the railway station.', 'On Market Street.'], answer: 1, explanation: '临时站在 King Street 邮局对面。' },
      { id: 'bs-2', prompt: 'How often will daytime buses run?', options: ['Every 10 minutes.', 'Every 15 minutes.', 'Every 20 minutes.', 'Every 30 minutes.'], answer: 2, explanation: '日间班次仍为每二十分钟一班。' },
      { id: 'bs-3', prompt: 'What changes about the final bus?', options: ['It leaves earlier.', 'It leaves later.', 'It starts at the market.', 'It runs only online.'], answer: 0, explanation: '末班车由十点四十五提前至十点十五。' },
    ],
  },
  {
    id: 'volunteer-induction',
    difficulty: 1,
    title: 'Community Garden Volunteers',
    context: '场景：负责人向新志愿者介绍花园工作。',
    transcript: 'Thank you for volunteering at Riverside Community Garden. New volunteers begin with a short safety tour at nine o’clock beside the main gate. Gloves and tools are provided, so you only need to bring drinking water and clothes suitable for the weather. This Saturday we will prepare vegetable beds rather than plant seeds because heavy rain is forecast for Sunday. At midday, everyone is invited to share lunch in the wooden shelter. Please tell us in advance if you have any food allergies.',
    questions: [
      { id: 'vi-1', prompt: 'Where does the safety tour begin?', options: ['At the wooden shelter.', 'Beside the main gate.', 'Near the vegetable beds.', 'At the river.'], answer: 1, explanation: '安全介绍在主入口旁开始。' },
      { id: 'vi-2', prompt: 'What should volunteers bring?', options: ['Their own tools.', 'Seeds and gloves.', 'Drinking water.', 'Lunch for everyone.'], answer: 2, explanation: '工具和手套提供，只需自带饮用水及合适衣物。' },
      { id: 'vi-3', prompt: 'Why will the group not plant seeds?', options: ['The beds are already full.', 'Rain is expected.', 'There are too few volunteers.', 'The seeds arrived late.'], answer: 1, explanation: '因为预计周日有大雨。' },
    ],
  },
  {
    id: 'sleep-study',
    difficulty: 2,
    title: 'Planning a Sleep Study',
    context: '场景：学生讨论睡眠研究的实验设计。',
    transcript: 'For our sleep study, we first thought of asking participants to remember a list of numbers. The supervisor said that task might favour people with strong mathematical skills, so we will use unfamiliar pictures instead. Participants will view the pictures in the evening and return for a memory test the following morning. We need to monitor their sleep, but asking everyone to stay in the laboratory would be expensive. Instead, they will wear small wrist devices at home. We should also collect information about caffeine because it could influence both sleep and test performance.',
    questions: [
      { id: 'ss-1', prompt: 'Why was the number task rejected?', options: ['It was too long.', 'It could favour mathematical ability.', 'The supervisor preferred words.', 'Participants saw it in the morning.'], answer: 1, explanation: '数字任务可能偏向数学能力强的人。' },
      { id: 'ss-2', prompt: 'How will sleep be monitored?', options: ['With home wrist devices.', 'In a hospital laboratory.', 'Through morning interviews.', 'Using cameras.'], answer: 0, explanation: '参与者在家佩戴腕部设备。' },
      { id: 'ss-3', prompt: 'What additional information will be collected?', options: ['Exercise habits.', 'Mathematical grades.', 'Caffeine intake.', 'Picture preferences.'], answer: 2, explanation: '咖啡因会影响睡眠和测试表现。' },
    ],
  },
  {
    id: 'archaeology-survey',
    difficulty: 2,
    title: 'Archaeological Site Survey',
    context: '场景：考古课程导师解释实地调查方法。',
    transcript: 'Before any digging begins, the team will carry out a surface survey. Students will walk along parallel lines five metres apart and mark visible pottery on a digital map. Do not remove an object when you first see it, because its exact position may reveal a pattern. After the mapping is complete, selected pieces will be collected and labelled. We had planned to use a drone for aerial photographs, but strong winds make that impossible this week. Instead, photographs will be taken from a temporary platform at the southern edge of the field.',
    questions: [
      { id: 'as-1', prompt: 'How far apart will the survey lines be?', options: ['2 metres.', '5 metres.', '10 metres.', '15 metres.'], answer: 1, explanation: '调查路线相距五米。' },
      { id: 'as-2', prompt: 'Why should objects initially remain in place?', options: ['They may be dangerous.', 'Their positions may show a pattern.', 'They belong to another team.', 'Labels are not available.'], answer: 1, explanation: '物体准确位置可能揭示分布规律。' },
      { id: 'as-3', prompt: 'Why will the team not use a drone?', options: ['The battery failed.', 'The field is too small.', 'The wind is too strong.', 'The platform is higher.'], answer: 2, explanation: '本周强风使无人机无法使用。' },
    ],
  },
  {
    id: 'language-prediction',
    difficulty: 3,
    title: 'Prediction in Language Processing',
    context: '场景：语言学讲座节选。',
    transcript: 'Listeners do not wait passively for every word in a sentence. They use context to predict what may come next, which can make familiar speech remarkably efficient. Evidence comes from eye-tracking studies: when people hear a verb such as eat, they often look towards an edible object before that object is named. Prediction is not always beneficial. A strongly expected word can make an unexpected alternative harder to process for a brief period. Moreover, predictions are shaped by experience, so speakers from different linguistic backgrounds may anticipate different structures. Researchers now emphasise flexibility rather than perfect prediction: successful listeners rapidly update their interpretation when the evidence changes.',
    questions: [
      { id: 'lp-1', prompt: 'What do eye-tracking studies show?', options: ['Listeners close their eyes during verbs.', 'People may look at a likely object before it is named.', 'Edible objects prevent prediction.', 'Familiar speech is always slow.'], answer: 1, explanation: '听到 eat 后，听者可能在目标词出现前看向可食物品。' },
      { id: 'lp-2', prompt: 'What can happen after a strong but incorrect expectation?', options: ['The alternative is briefly harder to process.', 'Speech becomes permanently unclear.', 'Experience stops affecting language.', 'Listeners predict perfectly next time.'], answer: 0, explanation: '预期错误会短暂增加处理意外词的难度。' },
      { id: 'lp-3', prompt: 'What quality do researchers now stress?', options: ['Vocabulary size.', 'Speaking volume.', 'Interpretive flexibility.', 'Perfect prediction.'], answer: 2, explanation: '研究者强调根据新证据快速更新解释的灵活性。' },
    ],
  },
  {
    id: 'circular-products',
    difficulty: 3,
    title: 'Designing Products for a Circular Economy',
    context: '场景：可持续设计讲座节选。',
    transcript: 'A circular economy aims to keep products and materials useful for longer, but recycling is only one part of the strategy. Design determines whether a product can be repaired, upgraded or taken apart. A device held together with standard screws may be opened without damage, whereas strong adhesives can make a simple battery replacement impossible. Manufacturers sometimes resist modular design because extra connectors add cost and may increase the size of a product. There is also no environmental benefit if consumers replace functioning modules merely because newer ones are available. For this reason, researchers assess actual behaviour as well as technical repairability. The most successful systems combine durable design, access to spare parts and business models that reward maintenance rather than rapid replacement.',
    questions: [
      { id: 'cp-1', prompt: 'Why are standard screws mentioned?', options: ['They make products larger.', 'They allow non-destructive opening.', 'They prevent all upgrades.', 'They are cheaper than spare parts.'], answer: 1, explanation: '标准螺丝便于无损拆开设备。' },
      { id: 'cp-2', prompt: 'What disadvantage of modular design is identified?', options: ['It always prevents repair.', 'Connectors may add cost and size.', 'Consumers cannot see new modules.', 'It removes the need for recycling.'], answer: 1, explanation: '额外连接件会增加成本，也可能增大产品尺寸。' },
      { id: 'cp-3', prompt: 'What do successful circular systems reward?', options: ['Frequent replacement.', 'Use of strong adhesives.', 'Maintenance.', 'Larger packaging.'], answer: 2, explanation: '成功体系应奖励维护，而非快速替换。' },
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
