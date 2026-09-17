import type { LearningStage, SkillAttempt } from '~/types/study'

export interface ReadingQuestion {
  id: string
  type?: 'choice' | 'text'
  prompt: string
  instruction?: string
  options?: string[]
  answer?: number
  acceptableAnswers?: string[]
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
  {
    id: 'repair-cafes',
    difficulty: 1,
    title: 'Repair Cafés',
    passage: 'In many towns, people throw away household objects that could still be used. A broken lamp may need only a new cable, while a chair may require a small piece of wood. Repair cafés were created to help with this problem. At these free community events, visitors bring damaged items and work beside volunteers who have practical skills. The volunteers do not simply repair everything for the visitor. Instead, they explain the problem and show the owner how to use the tools safely. This means that visitors may be able to solve similar problems by themselves in the future. Repair cafés cannot accept every object. Organisers usually refuse items that are dangerous or need specialist equipment. They also make clear that a successful repair is not guaranteed. Even so, the events keep many objects out of rubbish sites and allow neighbours of different ages to meet. Some local libraries now host a repair café once a month because they already have public rooms and are easy to reach by bus.',
    questions: [
      { id: 'rc-1', prompt: 'What is the main aim of a repair café?', options: ['To sell new household objects.', 'To help people repair damaged items.', 'To provide specialist factory equipment.', 'To collect objects for museums.'], answer: 1, explanation: '活动的核心是协助人们修理仍可使用的物品。' },
      { id: 'rc-2', type: 'text', prompt: 'What may a broken lamp need?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['a new cable', 'new cable'], explanation: '第一段直接提到 a new cable。' },
      { id: 'rc-3', prompt: 'Volunteers always complete the repair for visitors.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '志愿者会讲解并让物主参与，而不是包办全部修理。' },
      { id: 'rc-4', type: 'text', prompt: 'Which public buildings sometimes provide rooms for repair cafés?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['libraries', 'library'], explanation: '结尾说明一些当地图书馆每月举办活动。' },
      { id: 'rc-5', prompt: 'Why are libraries suitable venues?', options: ['They sell tools.', 'They guarantee repairs.', 'They have rooms and public transport access.', 'Only young people visit them.'], answer: 2, explanation: '图书馆已有公共房间，而且乘公交容易到达。' },
    ],
  },
  {
    id: 'rooftop-farms',
    difficulty: 2,
    title: 'Farming Above the City',
    passage: 'As cities become denser, interest in producing food on rooftops has grown. Supporters argue that rooftop farms use space that would otherwise remain empty and can shorten the distance between growers and consumers. Some buildings use lightweight containers filled with soil, while others install hydroponic systems in which roots receive nutrients from water. Neither method is suitable for every roof. Engineers must first check how much weight the building can safely carry, and growers need reliable access to water. Wind exposure is another challenge because tall buildings may experience conditions that damage young plants. The environmental benefits are also more complex than they first appear. A local tomato avoids a long journey by truck, but a heated rooftop greenhouse may consume considerable energy in winter. Researchers therefore compare entire production systems rather than assuming that all local food has a smaller environmental footprint. Rooftop farms can provide benefits beyond food. Plants may absorb some rainwater, reducing pressure on drains during storms, and green spaces can make the upper floors of a building cooler. Several schools use small rooftop gardens as outdoor classrooms. These projects rarely produce enough food to supply a whole neighbourhood, yet they can teach students where food comes from and how weather affects crops. For planners, the strongest case for rooftop agriculture may therefore be its combination of modest food production, environmental services and education.',
    questions: [
      { id: 'rf-1', type: 'text', prompt: 'What must engineers check before a farm is installed?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['weight', 'roof weight', 'building weight'], explanation: '工程师首先检查建筑可安全承受的重量。' },
      { id: 'rf-2', prompt: 'Hydroponic systems supply plant roots with nutrients through water.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0, explanation: '第一段明确给出了水培系统的定义。' },
      { id: 'rf-3', prompt: 'Why might a local greenhouse tomato still have a large environmental footprint?', options: ['It needs transport by truck.', 'It may require winter heating.', 'It absorbs too much rainwater.', 'It grows only in schools.'], answer: 1, explanation: '冬季加热温室可能消耗大量能源。' },
      { id: 'rf-4', type: 'text', prompt: 'What city infrastructure can benefit when plants hold rainwater?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['drains', 'drainage'], explanation: '植物蓄水可减轻排水系统压力。' },
      { id: 'rf-5', prompt: 'What is the writer’s overall view?', options: ['Rooftop farms can replace rural agriculture.', 'Every roof should grow food.', 'Their value comes from several combined benefits.', 'Education is their only useful function.'], answer: 2, explanation: '结尾强调食物、环境服务和教育的综合价值。' },
    ],
  },
  {
    id: 'plastic-sorting',
    difficulty: 2,
    title: 'Why Plastic Sorting Is Difficult',
    passage: 'Consumers are often told to place plastic packaging in a recycling bin, but the material does not form a single, uniform group. Different polymers melt at different temperatures and cannot always be processed together. A clear drinks bottle, a flexible food wrapper and a black meal tray may therefore follow completely different routes after collection. At a sorting facility, machines first separate objects by size and shape. Magnets remove metals, while optical sensors shine light on plastic items and analyse the reflected signal to identify their chemical type. These sensors work quickly, but they are not perfect. Very dark plastic has traditionally been difficult to recognise because it absorbs much of the light. Food left inside a container can also reduce the quality of the final recycled material. Design choices made before an item reaches the consumer can determine whether recycling is economical. Packaging that combines several layers may protect food extremely well, yet separating those layers later can cost more than the recovered material is worth. Labels, glues and coloured additives create further complications. In response, some manufacturers are moving towards containers made from one widely recycled polymer and using labels that separate more easily. Recycling alone cannot solve the problem of plastic waste. Each collection, sorting and processing stage uses energy, and a portion of the material is lost. Specialists generally place reduction and reuse before recycling: avoiding unnecessary packaging prevents waste entirely, while a durable container can complete many journeys before it is processed. Effective policy must therefore consider product design and consumption as well as the technology inside recycling plants.',
    questions: [
      { id: 'ps-1', prompt: 'Why can different plastics not always be processed together?', options: ['They are collected on different days.', 'They melt at different temperatures.', 'They all absorb light.', 'They contain metal magnets.'], answer: 1, explanation: '不同聚合物的熔点不同。' },
      { id: 'ps-2', type: 'text', prompt: 'What equipment identifies the chemical type of plastic?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['optical sensors', 'sensors'], explanation: '分拣厂使用 optical sensors 识别材料类型。' },
      { id: 'ps-3', prompt: 'Dark plastic is easier for optical equipment to identify.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '深色塑料吸收光线，传统上更难识别。' },
      { id: 'ps-4', prompt: 'Why can multi-layer packaging be uneconomical to recycle?', options: ['It fails to protect food.', 'Its layers are costly to separate.', 'It is made only from metal.', 'Consumers refuse to buy it.'], answer: 1, explanation: '分离多层材料的成本可能超过回收材料价值。' },
      { id: 'ps-5', type: 'text', prompt: 'Which strategy comes first in the specialists’ hierarchy?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['reduction', 'reduce'], explanation: '专家通常将 reduction and reuse 放在 recycling 之前。' },
    ],
  },
  {
    id: 'pollinator-corridors',
    difficulty: 3,
    title: 'Connecting Habitats for Pollinators',
    passage: 'Concern about declining insect populations has encouraged cities to create strips of flowering habitat along roads, railways and waterways. These so-called pollinator corridors are intended to link parks and gardens that would otherwise remain isolated. The underlying idea comes from landscape ecology: a species may disappear from a small patch even when the patch itself appears suitable, because individuals cannot move safely between feeding and nesting sites. A connected network should, in theory, allow insects to find resources across a larger area and recolonise places after a local decline. Measuring whether a corridor works is less straightforward than planting it. A rise in the number of insects at one site might reflect favourable weather rather than improved connectivity. Researchers therefore compare multiple locations over several years and record not only abundance but also which species are present. Common generalist bees can use many flowers and may respond quickly, whereas a specialist species may depend on one plant or a particular type of bare ground for nesting. A corridor that looks colourful to people may consequently offer little to the insects most in need of support. Maintenance decisions can also produce unintended effects. Cutting vegetation too frequently removes flowers before seeds develop; cutting nothing at all may allow a few vigorous plants to dominate. Some projects use rotational mowing, leaving different sections undisturbed each year. Others remove nutrient-rich topsoil because many native wildflowers compete better in poorer ground. Such interventions can appear destructive at first, which makes public explanation important. Corridors are not substitutes for large, high-quality habitats. They can, however, improve movement through heavily developed areas when planners select locally appropriate plants, provide nesting conditions and coordinate management across property boundaries. Their success depends less on the simple length of a flower strip than on whether it supplies the right resources at the right times.',
    questions: [
      { id: 'pc-1', prompt: 'What ecological problem are corridors designed to address?', options: ['Excessive rainfall.', 'Isolation between habitat patches.', 'A lack of public roads.', 'Overproduction of seeds.'], answer: 1, explanation: '走廊用于连接原本孤立的公园和花园。' },
      { id: 'pc-2', prompt: 'An increase in insects at one location proves that a corridor is effective.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '数量上升也可能由天气造成，不能单点直接证明。' },
      { id: 'pc-3', type: 'text', prompt: 'What kind of bees may react rapidly to a wide range of flowers?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['generalist', 'generalists'], explanation: '常见的 generalist bees 能利用多种花。' },
      { id: 'pc-4', type: 'text', prompt: 'Which maintenance method leaves different areas untouched in different years?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['rotational mowing'], explanation: '文中用 rotational mowing 描述轮换保留区域。' },
      { id: 'pc-5', prompt: 'Which statement best summarises the final paragraph?', options: ['Long flower strips always succeed.', 'Corridors should replace large habitats.', 'Success requires suitable resources and coordinated management.', 'Public explanation is unnecessary.'], answer: 2, explanation: '结尾强调合适资源、筑巢条件和跨边界协同管理。' },
    ],
  },
  {
    id: 'ancient-navigation',
    difficulty: 3,
    title: 'Reading the Ocean Without Instruments',
    passage: 'Long before electronic instruments, navigators in the Pacific travelled between islands separated by vast areas of open ocean. Their knowledge was not a collection of isolated tricks but a trained system for interpreting relationships among stars, waves, winds, birds and clouds. Much of the learning took place through repeated voyages with an expert rather than through written charts. At night, navigators used the rising and setting positions of particular stars to maintain a direction. A star eventually moved too high or disappeared, so another star with a similar directional position had to replace it. During the day, the sun offered a broad guide, but ocean swells were often more useful. Regular wave patterns can travel far beyond the weather that created them. Experienced navigators learned how a canoe moved across these patterns and could sometimes detect when waves were reflected from an island. Living organisms supplied additional evidence. Certain seabirds feed at sea but return to land before night, so their evening flight may indicate the direction of an island. This clue has limits: different species travel different distances, and a bird encountered in the morning may be flying away from land. Clouds can also form or remain stationary above islands, but cloud observations are easily confused with ordinary weather. No single sign was treated as decisive. Navigators combined observations and continually revised their estimate of position, a process sometimes described as keeping a mental map while imagining the canoe as stationary and the islands moving past it. Colonial authorities and imported navigation technologies contributed to a decline in traditional training in some regions. In recent decades, however, voyaging groups have worked with surviving experts to reconstruct routes and teaching methods. Successful long-distance voyages made without modern instruments have demonstrated the precision of the system, while also showing that it depends on years of guided practice. The revival is therefore not simply a historical performance; it preserves a demanding way of understanding the ocean and the knowledge encoded in local languages.',
    questions: [
      { id: 'an-1', prompt: 'How was navigation knowledge mainly learned?', options: ['From printed maps.', 'Through repeated voyages with experts.', 'By observing one star.', 'From colonial authorities.'], answer: 1, explanation: '学习主要通过跟随专家反复航行。' },
      { id: 'an-2', type: 'text', prompt: 'What daytime feature could remain useful after the weather that formed it?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['ocean swells', 'wave patterns', 'swells'], explanation: '远距离传播的海浪模式可超出其形成天气范围。' },
      { id: 'an-3', prompt: 'A seabird seen in the morning always points towards land.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '早晨的鸟可能正从陆地飞离。' },
      { id: 'an-4', prompt: 'Why did navigators combine several observations?', options: ['Every sign had limitations.', 'Stars were never visible.', 'They considered the canoe to be moving fastest.', 'Birds could not fly over water.'], answer: 0, explanation: '星、鸟、云等单一线索都有局限，因此需要综合判断。' },
      { id: 'an-5', type: 'text', prompt: 'What is required in addition to the navigation system itself?', instruction: 'NO MORE THAN THREE WORDS', acceptableAnswers: ['years of guided practice', 'guided practice'], explanation: '复兴航行证明该体系需要多年指导式练习。' },
    ],
  },
  {
    id: 'office-sound',
    difficulty: 3,
    title: 'The Problem Is Not Simply Noise',
    passage: 'Debates about office design often treat sound as a matter of volume: open offices are assumed to be distracting because they are noisy, while enclosed rooms are considered productive because they are quiet. Laboratory research suggests a more specific mechanism. Speech is unusually difficult to ignore because the brain automatically processes meaningful changes in language. A nearby conversation can therefore disrupt reading or writing even when it is not particularly loud. Steady mechanical sound may be more noticeable on a sound meter yet less damaging to a task involving words. The effect also depends on what an employee is doing. Routine visual work may continue with little disruption, whereas composing a report places heavy demands on verbal working memory. Individual preference matters, but allowing everyone to choose music through headphones is not a complete solution. Music with lyrics introduces additional language, and continuous headphone use can make spontaneous collaboration harder. Designers have tried to solve the problem with sound-absorbing ceilings, screens and background sound systems. These measures reduce how far speech travels, but their value depends on layout and behaviour. A highly absorbent room still becomes distracting if meetings take place beside desks intended for concentration. Some organisations now divide space according to activity rather than rank: quiet zones for focused work, shared tables for brief cooperation and enclosed rooms for calls. This arrangement only works if employees understand the purpose of each area and managers do not treat quiet zones as spare meeting rooms. Researchers caution against using productivity surveys alone to evaluate changes. Workers can accurately report annoyance, but perceived improvement does not always correspond to better performance, and short trials may be distorted by the novelty of a redesigned space. Strong evaluations combine surveys with task measures and observe the office long enough for new habits to settle. The broader lesson is that acoustic design is not a search for silence. It is an attempt to match the sound environment to the cognitive demands of work while preserving opportunities for useful interaction.',
    questions: [
      { id: 'os-1', prompt: 'Why is speech particularly distracting?', options: ['It is always louder than machinery.', 'The brain processes meaningful language changes.', 'It prevents all visual work.', 'Sound meters cannot detect it.'], answer: 1, explanation: '大脑会自动处理有意义的语言变化。' },
      { id: 'os-2', prompt: 'Steady mechanical sound may be less harmful to language tasks than a conversation.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0, explanation: '第一段明确作出这一对比。' },
      { id: 'os-3', type: 'text', prompt: 'Which mental system is heavily used when writing a report?', instruction: 'NO MORE THAN THREE WORDS', acceptableAnswers: ['verbal working memory', 'working memory'], explanation: '写报告对 verbal working memory 要求很高。' },
      { id: 'os-4', prompt: 'What is necessary for activity-based spaces to work?', options: ['Managers must reserve quiet zones for meetings.', 'Every employee must wear headphones.', 'People must respect the purpose of each area.', 'All background sound must be removed.'], answer: 2, explanation: '员工需理解各区域用途，管理者也不能挪用安静区。' },
      { id: 'os-5', type: 'text', prompt: 'What can temporarily influence reactions to a newly designed office?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['novelty'], explanation: '短期试验可能受到新鲜感影响。' },
    ],
  },
]

export function getReadingLesson(id: string | undefined) {
  return READING_LESSONS.find(lesson => lesson.id === id)
}

function normalizeTextAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ')
}

export function isReadingAnswerCorrect(question: ReadingQuestion, answer: number | string | null) {
  if (question.type === 'text') {
    if (typeof answer !== 'string')
      return false
    const normalized = normalizeTextAnswer(answer)
    return (question.acceptableAnswers ?? []).some(candidate => normalizeTextAnswer(candidate) === normalized)
  }
  return typeof answer === 'number' && answer === question.answer
}

export function readingExpectedAnswer(question: ReadingQuestion) {
  if (question.type === 'text')
    return question.acceptableAnswers?.[0] ?? ''
  return question.options?.[question.answer ?? -1] ?? ''
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
