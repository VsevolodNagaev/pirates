export const RULES = [
  { id: 'obshhie', file: '01-obshhie-polozheniya.md', num: '01', title: 'Общие положения' },
  { id: 'anturazh', file: '02-anturazh-i-byt.md', num: '02', title: 'Антураж и быт' },
  { id: 'korabli', file: '03-korabli.md', num: '03', title: 'Корабли' },
  { id: 'more', file: '04-morskie-srazheniya.md', num: '04', title: 'Морские сражения' },
  { id: 'forty', file: '05-forty-i-bereg.md', num: '05', title: 'Форты и берег' },
  { id: 'boj', file: '06-boevye-vzaimodeystviya.md', num: '06', title: 'Боевые взаимодействия' },
  { id: 'ekonomika', file: '07-ekonomika.md', num: '07', title: 'Экономика' },
  { id: 'roli', file: '08-roli-i-frakcii.md', num: '08', title: 'Роли и фракции' },
  { id: 'medicina', file: '09-medicina.md', num: '09', title: 'Медицина' },
  { id: 'dokumenty', file: '10-dokumenty-i-diplomatiya.md', num: '10', title: 'Документы и дипломатия' },
  { id: 'ekspedicii', file: '11-ekspedicii-i-danji.md', num: '11', title: 'Экспедиции и данжи' },
  { id: 'buhta', file: '12-tihaya-buhta.md', num: '12', title: 'Тихая бухта' },
  { id: 'zavedeniya', file: '13-zavedeniya.md', num: '13', title: 'Заведения' },
] as const

export type RuleId = (typeof RULES)[number]['id']
