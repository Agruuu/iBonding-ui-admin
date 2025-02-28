/**
 * Created by Agruuu
 *
 * AI Enumeration class
 *
 * problem：Why not put it in `src/utils/constants.ts`?
 * answer：Mainly, the AI is an optional module. Considering independence and decoupling, it is placed in `/views/ai/utils/constants.ts`.
 */

/**
 * AI Platform enumeration
 */
export const AiPlatformEnum = {
  TONG_YI: 'TongYi', // Alibaba
  YI_YAN: 'YiYan', // Baidu
  DEEP_SEEK: 'DeepSeek', // DeepSeek
  ZHI_PU: 'ZhiPu', // Zhipu AI
  XING_HUO: 'XingHuo', // IFlytek
  OPENAI: 'OpenAI',
  Ollama: 'Ollama',
  STABLE_DIFFUSION: 'StableDiffusion', // Stability AI
  MIDJOURNEY: 'Midjourney', // Midjourney
  SUNO: 'Suno' // Suno AI
}

export const OtherPlatformEnum: ImageModelVO[] = [
  {
    key: AiPlatformEnum.TONG_YI,
    name: '通义万相'
  },
  {
    key: AiPlatformEnum.YI_YAN,
    name: '百度千帆'
  },
  {
    key: AiPlatformEnum.ZHI_PU,
    name: '智谱 AI'
  }
]

/**
 * AI Enumeration of image generation status
 */
export const AiImageStatusEnum = {
  IN_PROGRESS: 10, // In progress
  SUCCESS: 20, // Completed
  FAIL: 30 // Failed
}

/**
 * AI Enumeration of music generation status
 */
export const AiMusicStatusEnum = {
  IN_PROGRESS: 10, // In progress
  SUCCESS: 20, // Completed
  FAIL: 30 // Failed
}

/**
 * AI Enumeration of writing types
 */
export enum AiWriteTypeEnum {
  WRITING = 1, // compose
  REPLY // reply
}

// Table display comparison map
export const AiWriteTypeTableRender = {
  [AiWriteTypeEnum.WRITING]: 'compose',
  [AiWriteTypeEnum.REPLY]: 'reply'
}

// ========== 【picture UI】Related enumeration ==========

export const ImageHotWords = [
  '中国旗袍',
  '古装美女',
  '卡通头像',
  '机甲战士',
  '童话小屋',
  '中国长城'
] // 图片热词

export const ImageHotEnglishWords = [
  'Chinese Cheongsam',
  'Ancient Beauty',
  'Cartoon Avatar',
  'Mech Warrior',
  'Fairy Tale Cottage',
  'The Great Wall of China'
] // Image buzzwords（english）

export interface ImageModelVO {
  key: string
  name: string
  image?: string
}

export const StableDiffusionSamplers: ImageModelVO[] = [
  {
    key: 'DDIM',
    name: 'DDIM'
  },
  {
    key: 'DDPM',
    name: 'DDPM'
  },
  {
    key: 'K_DPMPP_2M',
    name: 'K_DPMPP_2M'
  },
  {
    key: 'K_DPMPP_2S_ANCESTRAL',
    name: 'K_DPMPP_2S_ANCESTRAL'
  },
  {
    key: 'K_DPM_2',
    name: 'K_DPM_2'
  },
  {
    key: 'K_DPM_2_ANCESTRAL',
    name: 'K_DPM_2_ANCESTRAL'
  },
  {
    key: 'K_EULER',
    name: 'K_EULER'
  },
  {
    key: 'K_EULER_ANCESTRAL',
    name: 'K_EULER_ANCESTRAL'
  },
  {
    key: 'K_HEUN',
    name: 'K_HEUN'
  },
  {
    key: 'K_LMS',
    name: 'K_LMS'
  }
]

export const StableDiffusionStylePresets: ImageModelVO[] = [
  {
    key: '3d-model',
    name: '3d-model'
  },
  {
    key: 'analog-film',
    name: 'analog-film'
  },
  {
    key: 'anime',
    name: 'anime'
  },
  {
    key: 'cinematic',
    name: 'cinematic'
  },
  {
    key: 'comic-book',
    name: 'comic-book'
  },
  {
    key: 'digital-art',
    name: 'digital-art'
  },
  {
    key: 'enhance',
    name: 'enhance'
  },
  {
    key: 'fantasy-art',
    name: 'fantasy-art'
  },
  {
    key: 'isometric',
    name: 'isometric'
  },
  {
    key: 'line-art',
    name: 'line-art'
  },
  {
    key: 'low-poly',
    name: 'low-poly'
  },
  {
    key: 'modeling-compound',
    name: 'modeling-compound'
  },
  // neon-punk origami photographic pixel-art tile-texture
  {
    key: 'neon-punk',
    name: 'neon-punk'
  },
  {
    key: 'origami',
    name: 'origami'
  },
  {
    key: 'photographic',
    name: 'photographic'
  },
  {
    key: 'pixel-art',
    name: 'pixel-art'
  },
  {
    key: 'tile-texture',
    name: 'tile-texture'
  }
]

export const TongYiWanXiangModels: ImageModelVO[] = [
  {
    key: 'wanx-v1',
    name: 'wanx-v1'
  },
  {
    key: 'wanx-sketch-to-image-v1',
    name: 'wanx-sketch-to-image-v1'
  }
]

export const QianFanModels: ImageModelVO[] = [
  {
    key: 'sd_xl',
    name: 'sd_xl'
  }
]

export const ChatGlmModels: ImageModelVO[] = [
  {
    key: 'cogview-3',
    name: 'cogview-3'
  }
]

export const StableDiffusionClipGuidancePresets: ImageModelVO[] = [
  {
    key: 'NONE',
    name: 'NONE'
  },
  {
    key: 'FAST_BLUE',
    name: 'FAST_BLUE'
  },
  {
    key: 'FAST_GREEN',
    name: 'FAST_GREEN'
  },
  {
    key: 'SIMPLE',
    name: 'SIMPLE'
  },
  {
    key: 'SLOW',
    name: 'SLOW'
  },
  {
    key: 'SLOWER',
    name: 'SLOWER'
  },
  {
    key: 'SLOWEST',
    name: 'SLOWEST'
  }
]

export const Dall3Models: ImageModelVO[] = [
  {
    key: 'dall-e-3',
    name: 'DALL·E 3',
    image: `/src/assets/ai/dall2.jpg`
  },
  {
    key: 'dall-e-2',
    name: 'DALL·E 2',
    image: `/src/assets/ai/dall3.jpg`
  }
]

export const Dall3StyleList: ImageModelVO[] = [
  {
    key: 'vivid',
    name: 'clear',
    image: `/src/assets/ai/qingxi.jpg`
  },
  {
    key: 'natural',
    name: 'natural',
    image: `/src/assets/ai/ziran.jpg`
  }
]

export interface ImageSizeVO {
  key: string
  name?: string
  style: string
  width: string
  height: string
}

export const Dall3SizeList: ImageSizeVO[] = [
  {
    key: '1024x1024',
    name: '1:1',
    width: '1024',
    height: '1024',
    style: 'width: 30px; height: 30px;background-color: #dcdcdc;'
  },
  {
    key: '1024x1792',
    name: '3:5',
    width: '1024',
    height: '1792',
    style: 'width: 30px; height: 50px;background-color: #dcdcdc;'
  },
  {
    key: '1792x1024',
    name: '5:3',
    width: '1792',
    height: '1024',
    style: 'width: 50px; height: 30px;background-color: #dcdcdc;'
  }
]

export const MidjourneyModels: ImageModelVO[] = [
  {
    key: 'midjourney',
    name: 'MJ',
    image: 'https://bigpt8.com/pc/_nuxt/mj.34a61377.png'
  },
  {
    key: 'niji',
    name: 'NIJI',
    image: 'https://bigpt8.com/pc/_nuxt/nj.ca79b143.png'
  }
]

export const MidjourneySizeList: ImageSizeVO[] = [
  {
    key: '1:1',
    width: '1',
    height: '1',
    style: 'width: 30px; height: 30px;background-color: #dcdcdc;'
  },
  {
    key: '3:4',
    width: '3',
    height: '4',
    style: 'width: 30px; height: 40px;background-color: #dcdcdc;'
  },
  {
    key: '4:3',
    width: '4',
    height: '3',
    style: 'width: 40px; height: 30px;background-color: #dcdcdc;'
  },
  {
    key: '9:16',
    width: '9',
    height: '16',
    style: 'width: 30px; height: 50px;background-color: #dcdcdc;'
  },
  {
    key: '16:9',
    width: '16',
    height: '9',
    style: 'width: 50px; height: 30px;background-color: #dcdcdc;'
  }
]

export const MidjourneyVersions = [
  {
    value: '6.0',
    label: 'v6.0'
  },
  {
    value: '5.2',
    label: 'v5.2'
  },
  {
    value: '5.1',
    label: 'v5.1'
  },
  {
    value: '5.0',
    label: 'v5.0'
  },
  {
    value: '4.0',
    label: 'v4.0'
  }
]

export const NijiVersionList = [
  {
    value: '5',
    label: 'v5'
  }
]

// ========== 【writing UI】Related enumeration ==========

/** Data when writing click examples **/
export const WriteExample = {
  write: {
    prompt: 'vue',
    data: 'Vue.js is a progressive JavaScript framework for building user interfaces. Its core library only focuses on the view layer, which is easy to get started with and also convenient to integrate with other libraries or existing projects.\n\n The features of Vue.js include: \n- Reactive data binding: Vue.js automatically synchronizes data with the DOM, making state management much simpler. \n- Componentization: Vue.js allows developers to build large - scale applications through small, independent, and usually reusable components. \n- Virtual DOM: Vue.js uses the virtual DOM to achieve fast rendering and improve performance. \n\n In Vue.js, a typical application structure may include: \n 1. Root instance: Every Vue application needs a root instance as an entry point. \n2. Component system: Custom reusable components can be created. \n3. Directives: Special attributes prefixed with v - that provide special behaviors for DOM elements. \n4. Interpolation: Used for text content to dynamically insert data into HTML. \n5. Computed properties and watchers: Used to handle complex data logic and respond to data changes. \n6. Conditional rendering: Determine the rendering of elements according to conditions. \n7. List rendering：Used to display list data. \n8. Event handling: Respond to user interactions.\n9. Form input binding: Handle form input and validation. \n10. Component lifecycle hooks: Execute specific functions at different stages of a component. \n\n Vue.js also provides the official router Vue Router and the state management library Vuex to support the construction of complex single - page applications (SPAs). \n\nDuring the development process, developers usually use Vue CLI, which is a powerful command - line tool for quickly generating Vue project scaffolds. It integrates modern front - end tools such as Babel and Webpack, as well as features for optimizing the development experience like hot reloading and code linting. \n\nThe Vue.js ecosystem also includes a large number of third - party libraries and plugins, such as Vuetify (UI component library), Vue Test Utils (testing tool), etc. These greatly enrich the development ecosystem of Vue.js. \n\nIn general, Vue.js is a flexible and efficient front - end framework suitable for the development of projects from small - scale ones to large - scale enterprise applications. Its ease of use, flexibility, and strong community support make it one of the preferred frameworks for many developers.'
  },
  reply: {
    originalContent: 'leader，I would like to ask for a leave',
    prompt: 'Not approved',
    data: 'Your leave application has been received，After verification and consideration，We are temporarily unable to approve your leave request。\n\nIf there are special circumstances or urgent matters，Please contact me promptly。\n\nWishing you all the best in your work。\n\nthank you。'
  }
}

// ========== 【Mind map UI】Related enumeration ==========

/** Example of Content Generation for Mind Maps **/
export const MindMapContentExample = `# Java Technology Stack

## core technology 
### Java SE
### Java EE

## frame
### Spring
#### Spring Boot
#### Spring MVC
#### Spring Data
### Hibernate
### MyBatis

## Building tools
### Maven
### Gradle

## version control 
### Git
### SVN

## test tools
### JUnit
### Mockito
### Selenium

## application server 
### Tomcat
### Jetty
### WildFly

## database
### MySQL
### PostgreSQL
### Oracle
### MongoDB

## Message queue
### Kafka
### RabbitMQ
### ActiveMQ

## Microservices
### Spring Cloud
### Dubbo

## Containerization
### Docker
### Kubernetes

## Cloud services
### AWS
### Azure
### Google Cloud

## development tool
### IntelliJ IDEA
### Eclipse
### Visual Studio Code`
