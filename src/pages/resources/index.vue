<script setup lang="ts">
const resources = [
  { label: '词汇', icon: 'i-carbon-chart-histogram', link: '/vocabulary', desc: '雅思词汇真经，22 章词汇、例句与本地音频。', meta: '3674 词' },
  { label: '语法', icon: 'i-carbon-load-balancer-vpc', link: '/grammar', desc: '新东方雅思语法视频、配套讲义和思维导图。', meta: '视频 · PDF · 导图' },
  { label: '听力', icon: 'i-carbon-headphones', link: '/listening', desc: '听力基本概念、179 考点词和雅思王语料库。', meta: '179 词音频' },
  { label: '阅读', icon: 'i-carbon-document', link: '/reading', desc: '538 考点词及阅读同义替换资料。', meta: '同义替换' },
  { label: '写作', icon: 'i-carbon-edit', link: '/writing', desc: '顾家北 100 句翻译练习与参考表达。', meta: '100 句' },
  { label: '单词打字', icon: 'i-carbon-keyboard', link: '/vocabulary/typing', desc: '通过跟打练习熟悉单词拼写并提高输入速度。', meta: '练习模式' },
]
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-10">
    <div class="mb-8">
      <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
        资源库
      </p>
      <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        原项目学习资料
      </h1>
      <p class="mt-3 max-w-2xl leading-7 text-gray-500 dark:text-gray-400">
        今日学习会自动安排内容；想自由浏览时，原有词汇、语法、听力、阅读和写作资料仍然全部保留在这里。
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <RouterLink v-for="resource in resources" :key="resource.link" :to="resource.link" class="group border border-gray-200 rounded-2xl bg-white p-6 transition dark:border-gray-700 hover:border-primary-300 dark:bg-gray-800 hover:shadow-sm dark:hover:border-primary-800">
        <div class="flex items-start justify-between gap-4">
          <span class="dark:bg-primary-950 h-11 w-11 flex items-center justify-center rounded-xl bg-primary-50 text-xl text-primary-700 dark:text-primary-300"><span :class="resource.icon" /></span>
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-300">{{ resource.meta }}</span>
        </div>
        <h2 class="mt-5 text-xl font-bold text-gray-950 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
          {{ resource.label }}
        </h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {{ resource.desc }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>
