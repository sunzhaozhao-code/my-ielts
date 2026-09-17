import { getReadingLesson } from '~/data/readingLessons'
import type { ReadingQuestion } from '~/data/readingLessons'

export interface ReadingMockPassage {
  id: string
  title: string
  passage: string
  questions: ReadingQuestion[]
}

function lesson(id: string) {
  const found = getReadingLesson(id)
  if (!found)
    throw new Error(`Missing reading lesson: ${id}`)
  return found
}

const pollinators = lesson('pollinator-corridors')
const navigation = lesson('ancient-navigation')
const office = lesson('office-sound')

export const READING_MOCK = {
  id: 'academic-practice-1',
  title: 'Academic Reading 完整题量训练 1',
  durationMinutes: 60,
  passages: [
    {
      id: pollinators.id,
      title: pollinators.title,
      passage: pollinators.passage,
      questions: [
        ...pollinators.questions,
        { id: 'pc-m6', type: 'text', prompt: 'Name one type of transport route beside which flowering habitat may be planted.', instruction: 'ONE WORD ONLY', acceptableAnswers: ['roads', 'railways'], explanation: '开头列出 roads、railways 和 waterways。' },
        { id: 'pc-m7', prompt: 'What can a connected network help insects do after a local decline?', options: ['Change their species.', 'Recolonise suitable places.', 'Avoid every predator.', 'Produce new plant varieties.'], answer: 1, explanation: '连通网络有助于物种在局部下降后重新进入栖息地。' },
        { id: 'pc-m8', prompt: 'Specialist insects can necessarily use any colourful flower strip.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '专性物种可能依赖某一种植物或筑巢地，色彩丰富不等于适用。' },
        { id: 'pc-m9', type: 'text', prompt: 'What may dominate if vegetation is never cut?', instruction: 'NO MORE THAN THREE WORDS', acceptableAnswers: ['vigorous plants', 'a few vigorous plants'], explanation: '完全不割草可能让少数生长旺盛的植物占据优势。' },
        { id: 'pc-m10', prompt: 'Why might nutrient-rich topsoil be removed?', options: ['To make paths longer.', 'To help native wildflowers compete.', 'To attract only common bees.', 'To prevent all seeds developing.'], answer: 1, explanation: '许多本地野花在较贫瘠的土壤中竞争更好。' },
        { id: 'pc-m11', prompt: 'Some management work may initially look harmful to the public.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0, explanation: '文章说明干预最初可能显得具有破坏性，因此需向公众解释。' },
        { id: 'pc-m12', prompt: 'The author believes corridors should replace large habitats.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '文章明确说 corridors are not substitutes for large, high-quality habitats。' },
        { id: 'pc-m13', type: 'text', prompt: 'What matters more than the simple length of a flower strip?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['right resources', 'the right resources'], explanation: '结尾强调在正确时间提供合适资源。' },
      ],
    },
    {
      id: navigation.id,
      title: navigation.title,
      passage: navigation.passage,
      questions: [
        ...navigation.questions,
        { id: 'an-m6', prompt: 'What feature of stars helped navigators maintain direction?', options: ['Their colour.', 'Their rising and setting positions.', 'Their distance from the moon.', 'Their brightness at midday.'], answer: 1, explanation: '航海者利用特定星星升起和落下的位置保持方向。' },
        { id: 'an-m7', type: 'text', prompt: 'What replaced a star after it moved too high or disappeared?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['another star'], explanation: '需要用方向位置相近的另一颗星替代。' },
        { id: 'an-m8', prompt: 'Waves reflected from an island could sometimes be detected.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0, explanation: '有经验的航海者有时能察觉岛屿反射的海浪。' },
        { id: 'an-m9', prompt: 'Why must seabird evidence be interpreted carefully?', options: ['All seabirds remain on land.', 'Species travel different distances and direction varies by time.', 'Birds cannot be seen at night.', 'Birds follow written charts.'], answer: 1, explanation: '不同物种飞行距离不同，早晨的鸟还可能正离开陆地。' },
        { id: 'an-m10', prompt: 'Cloud observations were always more reliable than stars.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '云很容易和普通天气混淆，且任何单一迹象都不是决定性的。' },
        { id: 'an-m11', type: 'text', prompt: 'In the mental map, what did navigators imagine was stationary?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['canoe', 'the canoe'], explanation: '心理地图把独木舟想象为静止、岛屿从旁移动。' },
        { id: 'an-m12', prompt: 'What contributed to a decline in traditional training?', options: ['Protected bird species.', 'Imported technology and colonial authorities.', 'A lack of ocean swells.', 'The use of local languages.'], answer: 1, explanation: '殖民当局和输入的导航技术促成了传统训练衰落。' },
        { id: 'an-m13', prompt: 'The recent revival is described only as historical entertainment.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '结尾说这不仅是历史表演，也保存理解海洋的方式与语言知识。' },
      ],
    },
    {
      id: office.id,
      title: office.title,
      passage: office.passage,
      questions: [
        ...office.questions,
        { id: 'os-m6', prompt: 'Traditional debate usually treats office sound mainly as a question of what?', options: ['Language.', 'Volume.', 'Rank.', 'Music.'], answer: 1, explanation: '开头指出办公室设计争论常把声音当作音量问题。' },
        { id: 'os-m7', prompt: 'Routine visual tasks may continue despite nearby sound.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0, explanation: '常规视觉工作可能几乎不受干扰。' },
        { id: 'os-m8', type: 'text', prompt: 'What feature of music can add more language to process?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['lyrics'], explanation: '带歌词的音乐会引入额外语言信息。' },
        { id: 'os-m9', prompt: 'What is one disadvantage of continuous headphone use?', options: ['It raises the sound meter reading.', 'It makes informal cooperation harder.', 'It removes verbal memory.', 'It increases meeting space.'], answer: 1, explanation: '持续戴耳机会让自发协作更困难。' },
        { id: 'os-m10', prompt: 'What do sound-absorbing measures primarily reduce?', options: ['The number of workers.', 'How far speech travels.', 'The need for quiet work.', 'The novelty of an office.'], answer: 1, explanation: '吸音措施减少语音传播距离。' },
        { id: 'os-m11', prompt: 'An absorbent room cannot become distracting.', instruction: 'TRUE / FALSE / NOT GIVEN', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: '若会议在专注工位旁进行，再吸音的房间也会干扰。' },
        { id: 'os-m12', type: 'text', prompt: 'Some organisations divide space according to activity rather than what?', instruction: 'ONE WORD ONLY', acceptableAnswers: ['rank'], explanation: '文章写道 according to activity rather than rank。' },
        { id: 'os-m13', prompt: 'Why are productivity surveys alone insufficient?', options: ['Workers cannot report annoyance.', 'Perceived improvement may not equal better performance.', 'They always last too long.', 'They measure sound perfectly.'], answer: 1, explanation: '主观改善感并不总与实际表现提升一致。' },
        { id: 'os-m14', type: 'text', prompt: 'What must have time to settle during a strong evaluation?', instruction: 'NO MORE THAN TWO WORDS', acceptableAnswers: ['new habits', 'habits'], explanation: '评估需持续足够久，让新习惯稳定下来。' },
      ],
    },
  ] as ReadingMockPassage[],
}

export const READING_MOCK_QUESTION_COUNT = READING_MOCK.passages.reduce((sum, passage) => sum + passage.questions.length, 0)
