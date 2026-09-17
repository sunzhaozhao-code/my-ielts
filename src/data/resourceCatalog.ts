import type { DailyTaskType } from '~/types/study'

export interface ResourceCatalogItem {
  id: string
  type: DailyTaskType
  label: string
  route: string
  available: boolean
  note: string
}

export const RESOURCE_CATALOG: ResourceCatalogItem[] = [
  { id: 'vocabulary:daily-new', type: 'vocabulary-new', label: '雅思词汇真经', route: '/vocabulary', available: true, note: '22 章、3674 条词汇和本地音频。' },
  { id: 'vocabulary:due-review', type: 'vocabulary-review', label: '词汇复习', route: '/vocabulary', available: true, note: 'Phase 1 使用手动完成，Phase 2 接入记忆状态。' },
  { id: 'grammar:foundation', type: 'grammar', label: '基础语法', route: '/grammar', available: true, note: '现有视频、讲义和思维导图。' },
  { id: 'listening:179', type: 'listening', label: '听力 179 考点词', route: '/listening/179practice', available: true, note: '179 条词汇及本地音频。' },
  { id: 'reading:538-keywords', type: 'reading', label: '阅读同义替换', route: '/reading', available: true, note: '现有 538 考点词资料。' },
  { id: 'writing:100-sentences', type: 'writing', label: '100 句翻译', route: '/writing', available: true, note: '100 个翻译练习。' },
]
