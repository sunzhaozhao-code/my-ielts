export interface GrammarQuestion {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface GrammarLesson {
  id: string
  title: string
  summary: string
  examples: Array<{ english: string; chinese: string }>
  questions: GrammarQuestion[]
}

const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): GrammarQuestion => ({ id, prompt, options, answer, explanation })

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'be-verbs',
    title: 'be 动词与基本句型',
    summary: 'be 动词用于说明身份、状态和位置。现在时根据主语使用 am、is、are；过去时使用 was、were。',
    examples: [{ english: 'She is a university student.', chinese: '她是一名大学生。' }, { english: 'They were tired after the journey.', chinese: '旅程后他们很累。' }],
    questions: [
      q('be-1', 'I ___ ready.', ['am', 'is', 'are', 'be'], 0, 'I 与 am 搭配。'), q('be-2', 'The book ___ on the desk.', ['am', 'is', 'are', 'were'], 1, '单数主语用 is。'), q('be-3', 'They ___ busy yesterday.', ['is', 'are', 'was', 'were'], 3, '复数主语的过去式用 were。'), q('be-4', 'There ___ two parks nearby.', ['is', 'are', 'was', 'be'], 1, 'two parks 是复数。'), q('be-5', 'She ___ not at home last night.', ['is', 'are', 'was', 'were'], 2, 'she 的过去式用 was。'),
    ],
  },
  {
    id: 'present-simple',
    title: '一般现在时',
    summary: '一般现在时描述习惯、事实和经常发生的动作。第三人称单数的谓语通常加 -s 或 -es。',
    examples: [{ english: 'He studies English every evening.', chinese: '他每天晚上学习英语。' }, { english: 'Water boils at 100°C.', chinese: '水在 100 摄氏度沸腾。' }],
    questions: [
      q('present-1', 'She ___ coffee every morning.', ['drink', 'drinks', 'drank', 'drinking'], 1, '第三人称单数用 drinks。'), q('present-2', 'I usually ___ the bus.', ['take', 'takes', 'took', 'taken'], 0, 'I 后使用动词原形。'), q('present-3', 'The sun ___ in the east.', ['rise', 'rises', 'rose', 'rising'], 1, '客观事实用一般现在时。'), q('present-4', 'Do they ___ here?', ['lives', 'live', 'lived', 'living'], 1, '助动词 do 后用原形。'), q('present-5', 'He does not ___ meat.', ['eats', 'ate', 'eat', 'eating'], 2, 'does not 后用原形。'),
    ],
  },
  {
    id: 'past-simple',
    title: '一般过去时',
    summary: '一般过去时描述过去已经结束的动作，常与 yesterday、last week、ago 等时间表达连用。',
    examples: [{ english: 'We visited the museum yesterday.', chinese: '我们昨天参观了博物馆。' }, { english: 'She did not call me.', chinese: '她没有给我打电话。' }],
    questions: [
      q('past-1', 'They ___ London last year.', ['visit', 'visits', 'visited', 'visiting'], 2, 'last year 要用过去式。'), q('past-2', 'I ___ a good film yesterday.', ['see', 'saw', 'seen', 'seeing'], 1, 'see 的过去式是 saw。'), q('past-3', 'Did you ___ the email?', ['received', 'receives', 'receive', 'receiving'], 2, 'did 后用原形。'), q('past-4', 'He ___ not attend the meeting.', ['do', 'does', 'did', 'was'], 2, '过去时否定使用 did not。'), q('past-5', 'We ___ very tired after the trip.', ['are', 'is', 'was', 'were'], 3, 'we 的 be 动词过去式是 were。'),
    ],
  },
  {
    id: 'present-perfect',
    title: '现在完成时',
    summary: '现在完成时连接过去与现在，结构为 have/has + 过去分词，常与 since、for、already、yet 连用。',
    examples: [{ english: 'I have lived here for three years.', chinese: '我在这里住了三年。' }, { english: 'She has already finished.', chinese: '她已经完成了。' }],
    questions: [
      q('perfect-1', 'She has ___ her work.', ['finish', 'finished', 'finishing', 'finishes'], 1, 'has 后接过去分词。'), q('perfect-2', 'I have known him ___ 2020.', ['for', 'since', 'during', 'at'], 1, '时间点前用 since。'), q('perfect-3', 'We have waited ___ two hours.', ['since', 'at', 'for', 'from'], 2, '时间段前用 for。'), q('perfect-4', 'Have you ___ been to Canada?', ['ever', 'yesterday', 'ago', 'last'], 0, 'ever 常用于现在完成时疑问句。'), q('perfect-5', 'He ___ not arrived yet.', ['have', 'has', 'is', 'did'], 1, '第三人称单数使用 has。'),
    ],
  },
  {
    id: 'future',
    title: '一般将来时',
    summary: 'will + 动词原形常表示预测或即时决定；be going to 常表示已有计划或明显迹象。',
    examples: [{ english: 'I will call you tonight.', chinese: '我今晚会给你打电话。' }, { english: 'They are going to travel next month.', chinese: '他们计划下个月旅行。' }],
    questions: [
      q('future-1', 'I think it ___ rain tomorrow.', ['will', 'did', 'has', 'was'], 0, '预测未来使用 will。'), q('future-2', 'She will ___ later.', ['comes', 'came', 'come', 'coming'], 2, 'will 后用原形。'), q('future-3', 'We are going to ___ a car.', ['buy', 'bought', 'buys', 'buying'], 0, 'be going to 后用原形。'), q('future-4', '___ you help me?', ['Did', 'Will', 'Have', 'Are'], 1, '询问未来意愿可用 Will。'), q('future-5', 'They ___ leave next week.', ['are going to', 'was', 'have', 'did'], 0, '已有计划使用 are going to。'),
    ],
  },
  {
    id: 'non-finite',
    title: 'want to do / enjoy doing',
    summary: '不同动词后接不同形式。want、plan、hope 常接 to do；enjoy、avoid、finish 常接 doing。',
    examples: [{ english: 'I want to improve my writing.', chinese: '我想提高写作。' }, { english: 'She enjoys reading.', chinese: '她喜欢阅读。' }],
    questions: [
      q('nonfinite-1', 'He wants ___ abroad.', ['study', 'to study', 'studying', 'studied'], 1, 'want 后接 to do。'), q('nonfinite-2', 'I enjoy ___ music.', ['listen', 'to listen', 'listening to', 'listened'], 2, 'enjoy 后接 doing。'), q('nonfinite-3', 'They decided ___ early.', ['leave', 'to leave', 'leaving', 'left'], 1, 'decide 后接 to do。'), q('nonfinite-4', 'Please avoid ___ late.', ['be', 'to be', 'being', 'been'], 2, 'avoid 后接 doing。'), q('nonfinite-5', 'She finished ___ the report.', ['write', 'to write', 'writing', 'wrote'], 2, 'finish 后接 doing。'),
    ],
  },
  {
    id: 'modal',
    title: '情态动词',
    summary: 'can、should、must、may 等情态动词后接动词原形，用来表达能力、建议、义务或可能性。',
    examples: [{ english: 'You should check your spelling.', chinese: '你应该检查拼写。' }, { english: 'She can speak French.', chinese: '她会说法语。' }],
    questions: [
      q('modal-1', 'You should ___ more.', ['practise', 'practises', 'practised', 'practising'], 0, '情态动词后用原形。'), q('modal-2', 'He can ___ well.', ['swims', 'swim', 'swam', 'swimming'], 1, 'can 后用原形。'), q('modal-3', 'Students must ___ their ID.', ['brings', 'bring', 'brought', 'bringing'], 1, 'must 后用原形。'), q('modal-4', 'It ___ rain later.', ['may', 'does', 'has', 'is'], 0, 'may 表示可能。'), q('modal-5', 'You ___ smoke here.', ['must', 'must not', 'can', 'may'], 1, 'must not 表示禁止。'),
    ],
  },
  {
    id: 'comparison',
    title: '比较级与最高级',
    summary: '比较两者常用比较级 + than；三者或更多范围内比较常用 the + 最高级。',
    examples: [{ english: 'This task is easier than the last one.', chinese: '这项任务比上一项容易。' }, { english: 'It is the largest city in the country.', chinese: '它是这个国家最大的城市。' }],
    questions: [
      q('compare-1', 'This book is ___ than that one.', ['cheap', 'cheaper', 'cheapest', 'the cheap'], 1, 'than 前使用比较级。'), q('compare-2', 'She is the ___ student in the class.', ['tall', 'taller', 'tallest', 'more tall'], 2, '范围内最高使用最高级。'), q('compare-3', 'Traffic is ___ today than yesterday.', ['bad', 'worse', 'worst', 'badly'], 1, 'bad 的比较级是 worse。'), q('compare-4', 'This is the ___ useful method.', ['more', 'most', 'much', 'many'], 1, '多音节形容词最高级用 most。'), q('compare-5', 'My room is as ___ as yours.', ['large', 'larger', 'largest', 'the large'], 0, 'as...as 中使用原级。'),
    ],
  },
  {
    id: 'passive',
    title: '被动语态',
    summary: '被动语态强调动作承受者，基本结构为 be + 过去分词，be 随时态变化。',
    examples: [{ english: 'English is spoken in many countries.', chinese: '许多国家使用英语。' }, { english: 'The bridge was built in 1990.', chinese: '这座桥建于 1990 年。' }],
    questions: [
      q('passive-1', 'The room is ___ every day.', ['clean', 'cleaned', 'cleaning', 'cleans'], 1, 'is + 过去分词构成被动。'), q('passive-2', 'The letter was ___ yesterday.', ['send', 'sent', 'sending', 'sends'], 1, 'send 的过去分词是 sent。'), q('passive-3', 'These cars are ___ in Japan.', ['make', 'made', 'making', 'makes'], 1, 'are made 是一般现在时被动。'), q('passive-4', 'The work will be ___ soon.', ['finish', 'finished', 'finishing', 'finishes'], 1, 'will be 后接过去分词。'), q('passive-5', 'The window ___ broken last night.', ['is', 'was', 'were', 'has'], 1, '单数且过去发生，使用 was。'),
    ],
  },
  {
    id: 'conditionals',
    title: '条件句',
    summary: '真实条件句常用 if + 一般现在时，主句用 will；与现在事实相反时常用 if + 过去式，主句用 would。',
    examples: [{ english: 'If it rains, we will stay home.', chinese: '如果下雨，我们会待在家。' }, { english: 'If I had more time, I would read more.', chinese: '如果我有更多时间，我会多读书。' }],
    questions: [
      q('conditional-1', 'If she studies, she ___ pass.', ['will', 'would', 'did', 'has'], 0, '真实条件句主句使用 will。'), q('conditional-2', 'If it ___ tomorrow, we will cancel.', ['rain', 'rains', 'rained', 'will rain'], 1, 'if 从句使用一般现在时。'), q('conditional-3', 'If I were you, I ___ accept.', ['will', 'would', 'am', 'have'], 1, '与现在事实相反，主句用 would。'), q('conditional-4', 'You will improve if you ___ daily.', ['practise', 'will practise', 'practised', 'practising'], 0, 'if 从句不用 will。'), q('conditional-5', 'If he had a car, he ___ drive there.', ['will', 'would', 'does', 'has'], 1, '假设情况使用 would。'),
    ],
  },
  {
    id: 'prepositions',
    title: '介词',
    summary: '时间常用 at（时刻）、on（具体日期）、in（月份、年份）；地点根据位置关系选择 at、in、on。',
    examples: [{ english: 'The class starts at nine.', chinese: '课程九点开始。' }, { english: 'I was born in 2000.', chinese: '我出生于 2000 年。' }],
    questions: [
      q('prep-1', 'The meeting is ___ Monday.', ['at', 'on', 'in', 'by'], 1, '具体星期前用 on。'), q('prep-2', 'She arrived ___ 8 a.m.', ['at', 'on', 'in', 'from'], 0, '具体时刻前用 at。'), q('prep-3', 'We travel ___ summer.', ['at', 'on', 'in', 'to'], 2, '季节前用 in。'), q('prep-4', 'The keys are ___ the table.', ['on', 'at', 'from', 'during'], 0, '在物体表面使用 on。'), q('prep-5', 'He lives ___ Shanghai.', ['at', 'on', 'in', 'for'], 2, '城市前通常用 in。'),
    ],
  },
  {
    id: 'relative-clause',
    title: '定语从句',
    summary: '定语从句修饰名词。who 常指人，which 指物，that 可指人或物，where 指地点。',
    examples: [{ english: 'The woman who called you is my teacher.', chinese: '给你打电话的女士是我的老师。' }, { english: 'This is the book that I bought.', chinese: '这是我买的书。' }],
    questions: [
      q('relative-1', 'The man ___ lives next door is a doctor.', ['which', 'who', 'where', 'when'], 1, '先行词为人，使用 who。'), q('relative-2', 'The phone ___ I bought is new.', ['who', 'where', 'that', 'when'], 2, '先行词为物，可用 that。'), q('relative-3', 'This is the town ___ I grew up.', ['who', 'where', 'which person', 'when'], 1, '地点使用 where。'), q('relative-4', 'The students ___ work hard improve quickly.', ['who', 'where', 'when', 'what'], 0, '指人的主语使用 who。'), q('relative-5', 'The film ___ we watched was excellent.', ['that', 'who', 'where', 'whose person'], 0, '指物且作宾语可用 that。'),
    ],
  },
  {
    id: 'object-clause',
    title: '宾语从句',
    summary: '宾语从句在动词后充当宾语。陈述内容常用 that，是否常用 if/whether，疑问词引导时使用陈述语序。',
    examples: [{ english: 'I think that this plan will work.', chinese: '我认为这个计划会奏效。' }, { english: 'Do you know where he lives?', chinese: '你知道他住在哪里吗？' }],
    questions: [
      q('object-1', 'I believe ___ she is right.', ['that', 'what', 'where', 'who is'], 0, '陈述内容可用 that 引导。'), q('object-2', 'Do you know where he ___?', ['does live', 'lives', 'live does', 'living'], 1, '宾语从句使用陈述语序。'), q('object-3', 'She asked ___ I was ready.', ['that', 'if', 'what', 'who'], 1, '表示“是否”使用 if。'), q('object-4', 'Tell me what you ___.', ['need', 'do need you', 'needs', 'needed do'], 0, '疑问词后使用陈述语序。'), q('object-5', 'I hope ___ you can come.', ['that', 'where', 'whose', 'when did'], 0, 'hope 后的陈述内容用 that。'),
    ],
  },
  {
    id: 'adverbial-clause',
    title: '状语从句',
    summary: '状语从句说明时间、原因、让步或结果。常见连接词包括 when、because、although、while、so that。',
    examples: [{ english: 'Although it was late, we continued.', chinese: '虽然很晚，我们还是继续了。' }, { english: 'I stayed home because I was ill.', chinese: '因为生病，我待在家里。' }],
    questions: [
      q('adverbial-1', '___ it was raining, they went out.', ['Although', 'Because of', 'So', 'Unless of'], 0, 'although 表示让步。'), q('adverbial-2', 'I left early ___ I felt sick.', ['because', 'although', 'unless', 'while of'], 0, 'because 引导原因。'), q('adverbial-3', 'Call me ___ you arrive.', ['when', 'because of', 'despite', 'so'], 0, 'when 引导时间。'), q('adverbial-4', 'He spoke slowly so that everyone ___ understand.', ['could', 'must to', 'is', 'has'], 0, 'so that 引导目的。'), q('adverbial-5', '___ she was cooking, I set the table.', ['While', 'Because of', 'Despite', 'So that'], 0, 'while 表示两个动作同时进行。'),
    ],
  },
]

export function getGrammarLesson(title?: string) {
  return GRAMMAR_LESSONS.find(lesson => lesson.title === title) ?? GRAMMAR_LESSONS[0]
}
