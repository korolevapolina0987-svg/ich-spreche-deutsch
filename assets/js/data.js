/* Ich spreche Deutsch — содержание уровня A00.
   Слова: [немецкий, перевод, род]  род: m (der), f (die), n (das), pl (die, мн. ч.), без рода — глаголы, наречия, страны.
   Фразы: [немецкий, перевод].
   type: new — новая тема, review — повторение и диктант, test — контрольная.
   from — из каких уроков берутся слова для смешанной практики. */

window.ISD_PLAYLIST = "PLpvrYdFr65leeHUbDPOQftEvU6qKhhi30";

window.ISD_MOUNTAINS = [
  { level: "A00", name: "Брокен", de: "Brocken", country: "Германия", h: 1141, open: true },
  { level: "A0", name: "Фельдберг", de: "Feldberg", country: "Германия", h: 1493 },
  { level: "A1", name: "Цугшпитце", de: "Zugspitze", country: "Германия", h: 2962 },
  { level: "A2", name: "Гросглокнер", de: "Großglockner", country: "Австрия", h: 3798 },
  { level: "B1", name: "Юнгфрау", de: "Jungfrau", country: "Швейцария", h: 4158 },
  { level: "B2", name: "Маттерхорн", de: "Matterhorn", country: "Швейцария", h: 4478 },
  { level: "C1", name: "Пик Дюфур", de: "Dufourspitze", country: "Швейцария", h: 4634 }
];

window.ISD_HUTS = [
  { id: 1, name: "Хижина «Hallo»", from: 1, to: 10,
    can: ["поздороваться и попрощаться", "назвать имя и страну", "сказать, где живёшь и что учишь", "рассказать, что любишь и что тебе нравится"],
    fact: "Брокен — самая высокая гора Гарца и всего севера Германии. Отсюда видно на десятки километров, если повезёт с погодой." },
  { id: 2, name: "Хижина «Ich kann»", from: 11, to: 20,
    can: ["сказать, что умеешь делать", "назвать возраст и профессию", "рассказать о семье и хобби", "связно рассказать о себе"],
    fact: "Вершина Брокена почти всегда в тумане — около трёхсот дней в году. Поэтому вид с неё ценят особенно." },
  { id: 3, name: "Хижина «Ich will»", from: 21, to: 30,
    can: ["сказать, чего хочешь и что хотел бы", "заказать еду и напитки", "сказать, куда едешь", "говорить о покупках и оплате"],
    fact: "На вершину до сих пор ходит паровоз: узкоколейная Брокенская железная дорога работает больше ста лет." },
  { id: 4, name: "Хижина «Das ist mein»", from: 31, to: 40,
    can: ["показать и назвать свои вещи", "представить семью и друзей", "сказать, дорого или дёшево", "считать до десяти и называть цены"],
    fact: "От Брокена получил имя «брокенский призрак» — огромная тень человека на облаках, окружённая радужным кольцом." },
  { id: 5, name: "Вершина Брокена", from: 41, to: 50,
    can: ["понимать все темы A00 вперемешку", "быстро строить фразы без подсказок", "переходить на уровень A0"],
    fact: "Гёте поднимался на Брокен в 1777 году, а позже сделал гору местом сцены Вальпургиевой ночи в «Фаусте»." }
];

window.ISD_PHRASES_OF_DAY = [
  ["Übung macht den Meister.", "Повторение — мать учения. Дословно: упражнение делает мастера."],
  ["Schritt für Schritt.", "Шаг за шагом."],
  ["Aller Anfang ist schwer.", "Всякое начало трудно."],
  ["Du schaffst das!", "Ты справишься!"],
  ["Langsam, aber sicher.", "Медленно, но верно."],
  ["Wer rastet, der rostet.", "Кто отдыхает, тот ржавеет."],
  ["Morgenstund hat Gold im Mund.", "Кто рано встаёт, тому бог подаёт."],
  ["Ohne Fleiß kein Preis.", "Без труда не вытащишь и рыбку из пруда."],
  ["Gut Ding will Weile haben.", "Хорошему делу нужно время."],
  ["Der Weg ist das Ziel.", "Путь — это и есть цель."],
  ["Jeden Tag ein bisschen besser.", "Каждый день — чуть лучше."],
  ["Auf geht's!", "Вперёд!"],
  ["Weiter so!", "Так держать!"],
  ["Ich bin stolz auf mich.", "Я горжусь собой."]
];

window.ISD_MOUNTAIN_WORDS = [
  ["Berg", "гора", "m"], ["Gipfel", "вершина", "m"], ["Hütte", "хижина", "f"],
  ["Weg", "путь, тропа", "m"], ["Wolke", "облако", "f"], ["Wald", "лес", "m"],
  ["Rucksack", "рюкзак", "m"], ["wandern", "ходить в поход", null]
];

window.ISD_LESSONS = [
{ n: 1, t: "Hallo! Знакомство", type: "new",
  sum: "Здороваемся, называем имя и страну. Глагол в форме «я»: отбрасываем -en и добавляем -e: heißen → ich heiße. С Украиной говорим с артиклем: aus der Ukraine.",
  w: [["Hallo", "привет"], ["ich", "я"], ["heißen", "называться, зовут"], ["kommen aus", "быть родом из"], ["Deutschland", "Германия"], ["Russland", "Россия"], ["Ukraine", "Украина", "f"], ["sprechen", "говорить (на языке)"], ["Deutsch", "немецкий язык"], ["Englisch", "английский язык"], ["und", "и"], ["arbeiten", "работать"], ["studieren", "учиться в вузе"], ["Tschüss", "пока"], ["Bis bald", "до скорого"]],
  p: [["Hallo! Ich heiße Alex.", "Привет! Меня зовут Алекс."], ["Ich komme aus Deutschland.", "Я из Германии."], ["Ich komme aus Russland.", "Я из России."], ["Ich komme aus der Ukraine.", "Я из Украины."], ["Ich spreche Deutsch.", "Я говорю по-немецки."], ["Ich spreche Englisch und Deutsch.", "Я говорю по-английски и по-немецки."], ["Ich arbeite und studiere.", "Я работаю и учусь."], ["Tschüss! Bis bald!", "Пока! До скорого!"]] },

{ n: 2, t: "Где я живу и что люблю", type: "new",
  sum: "leben — жить, lieben — любить: различаются долготой звука. wohnen — проживать в городе. lernen — учить язык. Ich mag — мне нравится (с существительным).",
  w: [["leben", "жить"], ["lieben", "любить"], ["wohnen", "проживать"], ["lernen", "учить, изучать"], ["mögen", "нравиться"], ["ich mag", "мне нравится"], ["dich", "тебя"], ["es", "это"], ["online", "онлайн"], ["Musik", "музыка", "f"], ["Sport", "спорт", "m"], ["in", "в"]],
  p: [["Ich lebe in Deutschland.", "Я живу в Германии."], ["Ich lebe in der Ukraine.", "Я живу в Украине."], ["Ich liebe dich.", "Я люблю тебя."], ["Ich liebe es.", "Я люблю это."], ["Ich wohne in Berlin.", "Я проживаю в Берлине."], ["Ich lerne Deutsch online.", "Я учу немецкий онлайн."], ["Ich lerne Englisch und Deutsch.", "Я учу английский и немецкий."], ["Ich mag Deutschland.", "Мне нравится Германия."], ["Ich mag Musik und Sport.", "Мне нравятся музыка и спорт."]] },

{ n: 3, t: "Мы и они: еда и напитки", type: "new",
  sum: "С wir (мы) и sie (они, вы) глагол не меняется: wir arbeiten, sie arbeiten. Sie с большой буквы — вежливое «вы». Еда и напитки идут без артикля.",
  w: [["wir", "мы"], ["sie", "они"], ["Sie", "вы (вежливо)"], ["hören", "слушать, слышать"], ["essen", "есть, кушать"], ["trinken", "пить"], ["Pizza", "пицца", "f"], ["Fisch", "рыба", "m"], ["Kaffee", "кофе", "m"], ["Tee", "чай", "m"]],
  p: [["Wir arbeiten.", "Мы работаем."], ["Sie leben in Russland.", "Они живут в России."], ["Wir wohnen in Berlin.", "Мы проживаем в Берлине."], ["Wir lernen Deutsch online.", "Мы учим немецкий онлайн."], ["Sie hören Musik.", "Они слушают музыку."], ["Wir essen Pizza.", "Мы едим пиццу."], ["Sie essen Fisch.", "Они едят рыбу."], ["Wir trinken Kaffee.", "Мы пьём кофе."], ["Wir trinken Tee.", "Мы пьём чай."]] },

{ n: 4, t: "Гулять, иметь, понимать", type: "new",
  sum: "Глагол всегда на втором месте: Ich arbeite heute. haben — иметь: Ich habe Zeit — у меня есть время. Sport machen или Sport treiben — заниматься спортом.",
  w: [["gehen", "идти"], ["spazieren gehen", "идти гулять"], ["heute", "сегодня"], ["jetzt", "сейчас"], ["haben", "иметь"], ["Zeit", "время", "f"], ["Geld", "деньги", "n"], ["verstehen", "понимать"], ["sehr", "очень"], ["gut", "хорошо"], ["machen", "делать, заниматься"], ["treiben", "заниматься (спортом)"]],
  p: [["Ich gehe spazieren.", "Я иду гулять."], ["Wir gehen spazieren.", "Мы идём гулять."], ["Ich arbeite heute.", "Я сегодня работаю."], ["Sie arbeiten jetzt.", "Они сейчас работают."], ["Ich habe Zeit.", "У меня есть время."], ["Sie haben Geld.", "У них есть деньги."], ["Ich verstehe es.", "Я понимаю это."], ["Wir verstehen es sehr gut.", "Мы понимаем это очень хорошо."], ["Ich mache Sport.", "Я занимаюсь спортом."], ["Wir treiben Sport.", "Мы занимаемся спортом."]] },

{ n: 5, t: "Диктант: уроки 1–4", type: "review", from: [1, 2, 3, 4],
  sum: "Повторяем все слова первых четырёх уроков перед контрольной: страны, глаголы, еду и напитки.",
  w: [], p: [] },

{ n: 6, t: "Повторение: всё вместе", type: "review", from: [1, 2, 3, 4],
  sum: "Собираем фразы с я, мы и они в одном упражнении. Самое сложное — когда всё вперемешку.",
  w: [],
  p: [["Wir kommen aus der Ukraine.", "Мы из Украины."], ["Sie kommen aus Russland.", "Они из России."], ["Wir sprechen Englisch.", "Мы говорим по-английски."], ["Wir lieben dich.", "Мы любим тебя."], ["Sie wohnen in Hamburg.", "Они проживают в Гамбурге."]] },

{ n: 7, t: "Контрольная 1, часть 1", type: "test", from: [1, 2, 3, 4],
  sum: "Проверка знаний по урокам 1–4. Если не всё получилось с первого раза — пройди ещё раз.",
  w: [],
  p: [["Ich arbeite hier.", "Я работаю здесь."], ["Wir heißen Nick und Anna.", "Нас зовут Ник и Анна."], ["Ich trinke Tee.", "Я пью чай."]] },

{ n: 8, t: "Контрольная 1, часть 2", type: "test", from: [1, 2, 3, 4],
  sum: "Вторая часть контрольной по урокам 1–4.",
  w: [["hier", "здесь"]],
  p: [["Sie heißen Alex und Maria.", "Их зовут Алекс и Мария."], ["Sie arbeiten und studieren.", "Они работают и учатся."], ["Sie verstehen es jetzt.", "Они понимают это сейчас."]] },

{ n: 9, t: "Хобби: путешествия, игры, книги", type: "new",
  sum: "Рассказываем об увлечениях. Наречие стоит после глагола: Ich reise oft — я часто путешествую, Ich tanze gut — я хорошо танцую.",
  w: [["reisen", "путешествовать"], ["oft", "часто"], ["spielen", "играть"], ["lesen", "читать"], ["tanzen", "танцевать"], ["schwimmen", "плавать"]],
  p: [["Wir reisen.", "Мы путешествуем."], ["Ich reise oft.", "Я часто путешествую."], ["Wir spielen.", "Мы играем."], ["Sie lesen.", "Они читают."], ["Ich höre Musik.", "Я слушаю музыку."], ["Ich tanze gut.", "Я хорошо танцую."], ["Ich schwimme gut.", "Я хорошо плаваю."], ["Ich schwimme oft.", "Я часто плаваю."]] },

{ n: 10, t: "Мне нравится делать: gern", type: "new",
  sum: "С глаголом «мне нравится» строим через gern: Ich lese gern — мне нравится читать. Без глагола остаётся Ich mag: Ich mag Kaffee. «Играть в» переводим без предлога: Fußball spielen.",
  w: [["gern", "охотно, с удовольствием"], ["Fußball", "футбол", "m"], ["Tennis", "теннис", "n"]],
  p: [["Ich lese gern.", "Мне нравится читать."], ["Ich reise gern.", "Мне нравится путешествовать."], ["Ich spiele gern Fußball.", "Мне нравится играть в футбол."], ["Ich höre gern Musik.", "Мне нравится слушать музыку."], ["Ich mache gern Sport.", "Мне нравится заниматься спортом."], ["Ich lerne gern Deutsch.", "Мне нравится учить немецкий."], ["Ich lebe gern in Berlin.", "Мне нравится жить в Берлине."], ["Ich trinke gern Kaffee.", "Мне нравится пить кофе."], ["Ich mag Tennis.", "Мне нравится теннис."]] },

{ n: 11, t: "Я умею: können", type: "new",
  sum: "Ich kann + глагол в конце: Ich kann Deutsch sprechen. sprechen — говорить на языке, sagen — сказать что-то. По-немецки — auf Deutsch.",
  w: [["können", "уметь, мочь"], ["ich kann", "я умею, я могу"], ["singen", "петь"], ["schreiben", "писать"], ["sagen", "сказать, говорить что-то"], ["auf Deutsch", "по-немецки"], ["auf Englisch", "по-английски"]],
  p: [["Ich kann schwimmen.", "Я умею плавать."], ["Ich kann singen.", "Я умею петь."], ["Ich kann Fußball spielen.", "Я умею играть в футбол."], ["Ich kann Deutsch sprechen.", "Я умею говорить по-немецки."], ["Ich kann es sagen.", "Я могу это сказать."], ["Ich kann es schreiben.", "Я могу это написать."], ["Ich lese auf Deutsch.", "Я читаю по-немецки."], ["Ich schreibe auf Englisch.", "Я пишу по-английски."], ["Ich singe und tanze.", "Я пою и танцую."], ["Wir sagen es.", "Мы это говорим."]] },

{ n: 12, t: "Повторение: хобби", type: "review", from: [9, 10, 11],
  sum: "Повторяем хобби, gern и können. Новое слово — Bücher, книги: Ich lese Bücher.",
  w: [["Bücher", "книги", "pl"]],
  p: [["Ich lese Bücher.", "Я читаю книги."], ["Ich lese gern Bücher.", "Мне нравится читать книги."], ["Wir machen es.", "Мы это делаем."], ["Sie spielen jetzt.", "Они сейчас играют."]] },

{ n: 13, t: "Контрольная 2, часть 1", type: "test", from: [9, 10, 11, 12],
  sum: "Проверка знаний по урокам 9–12: хобби, gern, können.",
  w: [], p: [["Ich kann es machen.", "Я могу это сделать."], ["Sie tanzen sehr gut.", "Они танцуют очень хорошо."]] },

{ n: 14, t: "Контрольная 2, часть 2", type: "test", from: [9, 10, 11, 12],
  sum: "Вторая часть контрольной по урокам 9–12.",
  w: [], p: [["Ich spiele gern Tennis.", "Мне нравится играть в теннис."], ["Sie reisen oft.", "Они часто путешествуют."]] },

{ n: 15, t: "Быть: ich bin", type: "new",
  sum: "Если в предложении нет другого глагола, нужен sein: Ich bin in Berlin. Возраст: Ich bin zwanzig Jahre alt. Профессия без артикля: Ich bin Lehrer, Ich bin Lehrerin.",
  w: [["sein", "быть"], ["ich bin", "я есть"], ["ist", "есть (он, она, оно)"], ["mein Name", "моё имя"], ["zwanzig", "двадцать"], ["dreißig", "тридцать"], ["fünfzig", "пятьдесят"], ["Jahre alt", "лет (о возрасте)"], ["Lehrer", "учитель", "m"], ["Lehrerin", "учительница", "f"], ["Student", "студент", "m"], ["Studentin", "студентка", "f"], ["Manager", "менеджер", "m"], ["glücklich", "счастливый"], ["so", "так"]],
  p: [["Ich bin in Deutschland.", "Я в Германии."], ["Mein Name ist Anna.", "Меня зовут Анна."], ["Ich bin Nick.", "Я Ник."], ["Ich bin zwanzig Jahre alt.", "Мне двадцать лет."], ["Ich bin fünfzig.", "Мне пятьдесят."], ["Ich bin Lehrer.", "Я учитель."], ["Ich bin Studentin.", "Я студентка."], ["Ich bin so glücklich.", "Я так счастлив."], ["Ich bin hier.", "Я здесь."]] },

{ n: 16, t: "Большой рассказ о себе", type: "new",
  sum: "Собираем всё изученное в связный рассказ: имя, страна, город, возраст, учёба и хобби.",
  w: [["viele", "много"], ["Hobbys", "хобби, увлечения", "pl"]],
  p: [["Hallo, ich heiße Nick.", "Привет, меня зовут Ник."], ["Ich wohne in Berlin.", "Я проживаю в Берлине."], ["Ich bin Student.", "Я студент."], ["Ich habe viele Hobbys.", "У меня много хобби."], ["Ich mag Musik.", "Мне нравится музыка."], ["Ich höre gern Musik.", "Мне нравится слушать музыку."], ["Ich gehe spazieren.", "Я хожу гулять."], ["Ich schwimme gern.", "Мне нравится плавать."], ["Ich kann tanzen.", "Я умею танцевать."]] },

{ n: 17, t: "Истории: семья и работа", type: "new",
  sum: "Мини-истории о Максе и Нике. Ich liebe meinen Job — я люблю свою работу. Врач-женщина: Ärztin. verheiratet — женат или замужем.",
  w: [["Wien", "Вена"], ["vierzig", "сорок"], ["Arzt", "врач", "m"], ["Ärztin", "врач (женщина)", "f"], ["Job", "работа", "m"], ["verheiratet", "женат, замужем"], ["zwei", "два"], ["Kinder", "дети", "pl"], ["schauen", "смотреть"], ["Filme", "фильмы", "pl"]],
  p: [["Mein Name ist Max.", "Меня зовут Макс."], ["Ich lebe in Wien.", "Я живу в Вене."], ["Ich bin vierzig Jahre alt.", "Мне сорок лет."], ["Ich bin Arzt.", "Я врач."], ["Ich liebe meinen Job.", "Я люблю свою работу."], ["Ich bin verheiratet.", "Я женат."], ["Ich habe zwei Kinder.", "У меня двое детей."], ["Ich habe so viele Hobbys.", "У меня так много хобби."], ["Ich schaue gern Filme.", "Мне нравится смотреть фильмы."]] },

{ n: 18, t: "Истории: из Австрии", type: "new",
  sum: "Ещё истории о себе. Ich mag Filme — мне нравятся фильмы, Ich schaue gern Filme — мне нравится смотреть фильмы.",
  w: [["Österreich", "Австрия"], ["Podcasts", "подкасты", "pl"]],
  p: [["Ich komme aus Österreich.", "Я из Австрии."], ["Ich mag Podcasts.", "Мне нравятся подкасты."], ["Ich höre gern Podcasts.", "Мне нравится слушать подкасты."], ["Ich mag Filme.", "Мне нравятся фильмы."], ["Ich schaue Filme.", "Я смотрю фильмы."], ["Ich lese auf Deutsch.", "Я читаю по-немецки."], ["Ich bin Studentin.", "Я студентка."]] },

{ n: 19, t: "Контрольная 3, часть 1", type: "test", from: [15, 16, 17, 18],
  sum: "Проверка знаний по урокам 15–18: sein, возраст, профессии, рассказ о себе.",
  w: [["Spanisch", "испанский язык"], ["Sushi", "суши", "n"]],
  p: [["Ich spreche Englisch und Spanisch.", "Я говорю по-английски и по-испански."], ["Ich mag Sushi.", "Мне нравятся суши."], ["Ich esse gern Sushi.", "Мне нравится есть суши."]] },

{ n: 20, t: "Контрольная 3, часть 2", type: "test", from: [15, 16, 17, 18],
  sum: "Вторая часть контрольной по урокам 15–18.",
  w: [["drei", "три"], ["Managerin", "менеджер (женщина)", "f"]],
  p: [["Ich habe drei Kinder.", "У меня трое детей."], ["Ich mag meinen Job.", "Мне нравится моя работа."], ["Ich bin Ärztin.", "Я врач."]] },

{ n: 21, t: "Я хочу: wollen и möchte", type: "new",
  sum: "Ich will — я хочу, Ich möchte — я хотел бы, это вежливее. Второй глагол уходит в конец: Ich will Deutsch lernen.",
  w: [["wollen", "хотеть"], ["ich will", "я хочу"], ["ich möchte", "я хотел бы"], ["schlafen", "спать"]],
  p: [["Ich will reisen.", "Я хочу путешествовать."], ["Ich will essen.", "Я хочу есть."], ["Ich will schlafen.", "Я хочу спать."], ["Ich will Musik hören.", "Я хочу слушать музыку."], ["Ich will Deutsch lernen.", "Я хочу учить немецкий."], ["Ich will Kaffee trinken.", "Я хочу пить кофе."], ["Ich möchte schlafen.", "Я хотел бы поспать."], ["Ich möchte essen.", "Я хотел бы поесть."]] },

{ n: 22, t: "У меня есть: haben", type: "new",
  sum: "Ich habe Hunger — я голоден. Исчисляемое слово в единственном числе требует артикля: Ich habe ein Problem. С числом артикль не нужен: zwei Bücher.",
  w: [["Hunger", "голод", "m"], ["Problem", "проблема", "n"], ["ein", "один, одно"], ["Euro", "евро", "m"], ["fünf", "пять"]],
  p: [["Ich habe Hunger.", "Я голоден."], ["Ich habe ein Problem.", "У меня проблема."], ["Ich habe fünf Euro.", "У меня пять евро."], ["Ich habe zwei Bücher.", "У меня две книги."], ["Ich kann lesen und schreiben.", "Я умею читать и писать."], ["Ich kann Tennis spielen.", "Я умею играть в теннис."], ["Ich sage Hallo.", "Я говорю «привет»."]] },

{ n: 23, t: "Идти, приходить, видеть", type: "new",
  sum: "Ich gehe arbeiten — я иду работать. dorthin — туда. kommen aus — быть родом из: Italien, Spanien. sehen — видеть.",
  w: [["dorthin", "туда"], ["kommen", "приходить"], ["Italien", "Италия"], ["Spanien", "Испания"], ["sehen", "видеть"]],
  p: [["Ich mache es jetzt.", "Я делаю это сейчас."], ["Ich gehe arbeiten.", "Я иду работать."], ["Ich gehe dorthin.", "Я иду туда."], ["Wir gehen dorthin.", "Мы идём туда."], ["Ich komme aus Italien.", "Я из Италии."], ["Ich komme aus Spanien.", "Я из Испании."], ["Ich sehe es.", "Я это вижу."]] },

{ n: 24, t: "Говорить быстро и медленно", type: "new",
  sum: "sprechen — и о языке, и о манере речи: Sie sprechen sehr schnell. Языки: Russisch, Spanisch.",
  w: [["Russisch", "русский язык"], ["schnell", "быстро"], ["langsam", "медленно"], ["München", "Мюнхен"]],
  p: [["Ich spreche Russisch.", "Я говорю по-русски."], ["Ich spreche Deutsch und Spanisch.", "Я говорю по-немецки и по-испански."], ["Sie sprechen sehr schnell.", "Они говорят очень быстро."], ["Sie sprechen langsam.", "Они говорят медленно."], ["Ich lebe in München.", "Я живу в Мюнхене."], ["Ich mag Pizza.", "Мне нравится пицца."], ["Ich liebe Musik.", "Я люблю музыку."]] },

{ n: 25, t: "Ехать, лететь, учиться", type: "new",
  sum: "fahren — ехать, fliegen — лететь. Направление в город или страну — nach: nach Berlin. Домой — nach Hause. studieren — изучать: Medizin.",
  w: [["Schokolade", "шоколад", "f"], ["fahren", "ехать"], ["fliegen", "лететь"], ["nach Hause", "домой"], ["nach", "в (город, страну)"], ["jeden Tag", "каждый день"], ["Medizin", "медицина", "f"], ["Europa", "Европа"]],
  p: [["Ich liebe Schokolade.", "Я люблю шоколад."], ["Ich fahre nach Hause.", "Я еду домой."], ["Ich fahre nach Berlin.", "Я еду в Берлин."], ["Ich fliege nach Deutschland.", "Я лечу в Германию."], ["Wir arbeiten jeden Tag.", "Мы работаем каждый день."], ["Ich studiere Medizin.", "Я изучаю медицину."], ["Ich studiere in Europa.", "Я учусь в Европе."]] },

{ n: 26, t: "Учиться, понимать, читать", type: "new",
  sum: "Как мы учимся и понимаем: schnell, langsam, wirklich. Наречие после глагола: Ich verstehe wirklich.",
  w: [["wirklich", "действительно"]],
  p: [["Ich lerne schnell.", "Я учусь быстро."], ["Wir lernen sehr schnell.", "Мы учимся очень быстро."], ["Ich verstehe gut.", "Я хорошо понимаю."], ["Sie verstehen wirklich.", "Они действительно понимают."], ["Ich lese oft.", "Я часто читаю."], ["Ich lese langsam.", "Я читаю медленно."], ["Ich schreibe auf Deutsch.", "Я пишу по-немецки."], ["Ich schreibe jetzt.", "Я сейчас пишу."]] },

{ n: 27, t: "Еда, напитки, помощь", type: "new",
  sum: "helfen — помогать: Sie helfen mir, Sie helfen uns. Еда и напитки без артикля: Fleisch, Saft, Milch, Wasser.",
  w: [["Köln", "Кёльн"], ["Frankfurt", "Франкфурт"], ["helfen", "помогать"], ["mir", "мне"], ["dir", "тебе"], ["uns", "нам"], ["Fleisch", "мясо", "n"], ["Saft", "сок", "m"], ["Milch", "молоко", "f"], ["Wasser", "вода", "n"]],
  p: [["Ich wohne in Köln.", "Я проживаю в Кёльне."], ["Sie helfen mir.", "Они помогают мне."], ["Sie helfen uns.", "Они помогают нам."], ["Ich esse Fleisch.", "Я ем мясо."], ["Wir trinken Saft.", "Мы пьём сок."], ["Ich trinke Milch.", "Я пью молоко."], ["Ich trinke Wasser.", "Я пью воду."]] },

{ n: 28, t: "Слышать хорошо и плохо", type: "new",
  sum: "Повторяем singen, tanzen, heißen и hören. Ich höre gut — я хорошо слышу, Ich höre schlecht — я плохо слышу.",
  w: [["schlecht", "плохо"]],
  p: [["Sie singen gut.", "Они хорошо поют."], ["Ich möchte tanzen.", "Я хотел бы потанцевать."], ["Sie heißen Marina und Iwan.", "Их зовут Марина и Иван."], ["Wir heißen Alex und Natalia.", "Нас зовут Алекс и Наталья."], ["Ich höre es oft.", "Я часто это слышу."], ["Wir hören es jeden Tag.", "Мы слышим это каждый день."], ["Ich höre sehr gut.", "Я очень хорошо слышу."], ["Ich höre schlecht.", "Я плохо слышу."]] },

{ n: 29, t: "Смотреть, чувствовать, покупать", type: "new",
  sum: "müde — уставший, glücklich — счастливый, с ich bin. kaufen — покупать: ein Ticket, zwei Tickets.",
  w: [["müde", "уставший"], ["kaufen", "покупать"], ["Ticket", "билет", "n"], ["Tickets", "билеты", "pl"]],
  p: [["Wir schauen Filme.", "Мы смотрим фильмы."], ["Ich bin müde.", "Я устал."], ["Ich bin so müde.", "Я так устал."], ["Ich bin sehr glücklich.", "Я очень счастлив."], ["Ich kaufe ein Ticket.", "Я покупаю билет."], ["Wir kaufen zwei Tickets.", "Мы покупаем два билета."], ["Sie kaufen drei Tickets.", "Они покупают три билета."], ["Ich will es kaufen.", "Я хочу это купить."]] },

{ n: 30, t: "Вместе и платить", type: "new",
  sum: "zusammen — вместе. schwimmen gehen — идти плавать. bezahlen — платить, оплачивать (так же говорят zahlen).",
  w: [["zusammen", "вместе"], ["schwimmen gehen", "идти плавать"], ["bezahlen", "платить, оплачивать"], ["zahlen", "платить"]],
  p: [["Wir reisen oft.", "Мы часто путешествуем."], ["Wir spielen zusammen.", "Мы играем вместе."], ["Ich gehe schwimmen.", "Я иду плавать."], ["Wir gehen schwimmen.", "Мы идём плавать."], ["Ich will bezahlen.", "Я хочу оплатить."], ["Ich möchte bezahlen.", "Я хотел бы оплатить."], ["Wir bezahlen.", "Мы платим."]] },

{ n: 31, t: "35 главных глаголов", type: "review", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  sum: "Повторяем 35 главных глаголов в форме «я»: ich habe, ich kann, ich sage, ich mache, ich gehe и другие.",
  w: [],
  p: [["Sie helfen dir.", "Они помогают тебе."], ["Ich sehe es.", "Я вижу это."]] },

{ n: 32, t: "Повторение: приветствия", type: "review", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  sum: "Приветствия на целый день и мой дом, моя машина: mein Haus, mein Auto.",
  w: [["Guten Morgen", "доброе утро"], ["Guten Tag", "добрый день"], ["Guten Abend", "добрый вечер"], ["Danke", "спасибо"], ["Haus", "дом", "n"], ["Auto", "машина", "n"]],
  p: [["Ich sage Guten Morgen.", "Я говорю «доброе утро»."], ["Ich sehe mein Haus.", "Я вижу свой дом."], ["Ich sehe mein Auto.", "Я вижу свою машину."], ["Ich fliege nach Berlin.", "Я лечу в Берлин."], ["Ich mache es jeden Tag.", "Я делаю это каждый день."]] },

{ n: 33, t: "Контрольная 4, часть 1", type: "test", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32],
  sum: "Проверка знаний по урокам 21–32.",
  w: [], p: [["Ich bin wirklich müde.", "Я действительно устал."], ["Wir gehen dorthin.", "Мы идём туда."]] },

{ n: 34, t: "Контрольная 4, часть 2", type: "test", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32],
  sum: "Вторая часть контрольной по урокам 21–32.",
  w: [], p: [["Ich bin sehr müde.", "Я очень устал."], ["Sie arbeiten schnell.", "Они работают быстро."]] },

{ n: 35, t: "Контрольная 4, часть 3", type: "test", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32],
  sum: "Третья часть контрольной по урокам 21–32.",
  w: [], p: [["Ich kann bezahlen.", "Я могу оплатить."], ["Sie verstehen dich.", "Они понимают тебя."]] },

{ n: 36, t: "Контрольная 4, часть 4", type: "test", from: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32],
  sum: "Последняя часть контрольной по урокам 21–32.",
  w: [], p: [["Ich gehe gern spazieren.", "Мне нравится ходить гулять."], ["Ich sage Danke.", "Я говорю «спасибо»."]] },

{ n: 37, t: "Это мой: mein и meine", type: "new",
  sum: "Das ist mein… для мужского и среднего рода, Das ist meine… для женского. Род в немецком часто не совпадает с русским: der Hund, das Zimmer.",
  w: [["das ist", "это"], ["mein", "мой (м., ср. р.)"], ["meine", "моя (ж. р.)"], ["Vater", "отец", "m"], ["Zimmer", "комната", "n"], ["Hund", "собака", "m"], ["Bruder", "брат", "m"], ["Freund", "друг", "m"], ["Buch", "книга", "n"], ["Computer", "компьютер", "m"], ["Familie", "семья", "f"], ["Idee", "идея", "f"], ["Mutter", "мама", "f"], ["Schwester", "сестра", "f"], ["Katze", "кошка", "f"], ["Wohnung", "квартира", "f"], ["Freundin", "подруга", "f"]],
  p: [["Das ist mein Vater.", "Это мой отец."], ["Das ist mein Zimmer.", "Это моя комната."], ["Das ist mein Hund.", "Это моя собака."], ["Das ist mein Freund.", "Это мой друг."], ["Das ist mein Buch.", "Это моя книга."], ["Das ist meine Familie.", "Это моя семья."], ["Das ist meine Mutter.", "Это моя мама."], ["Das ist meine Katze.", "Это моя кошка."], ["Das ist meine Wohnung.", "Это моя квартира."], ["Das ist meine Idee.", "Это моя идея."]] },

{ n: 38, t: "Это интересно: es ist", type: "new",
  sum: "С прилагательным чаще говорят es ist: Es ist interessant. Das ist тоже верно. Усиливаем словами sehr и so.",
  w: [["interessant", "интересно"], ["einfach", "легко, просто"], ["teuer", "дорого"], ["billig", "дёшево"]],
  p: [["Es ist interessant.", "Это интересно."], ["Es ist sehr interessant.", "Это очень интересно."], ["Es ist so gut.", "Это так хорошо."], ["Es ist schnell.", "Это быстро."], ["Es ist sehr langsam.", "Это очень медленно."], ["Es ist einfach.", "Это легко."], ["Es ist teuer.", "Это дорого."], ["Es ist sehr teuer.", "Это очень дорого."], ["Es ist billig.", "Это дёшево."]] },

{ n: 39, t: "Числа, цены и артикль ein", type: "new",
  sum: "После ich habe: einen для мужского рода, ein для среднего, eine для женского. Es kostet — это стоит. Считаем до десяти.",
  w: [["einen", "один (м. р., кого/что)"], ["eine", "одна"], ["Frage", "вопрос", "f"], ["kosten", "стоить"], ["Dollar", "доллар", "m"], ["eins", "один"], ["vier", "четыре"], ["sechs", "шесть"], ["sieben", "семь"], ["acht", "восемь"], ["neun", "девять"], ["zehn", "десять"], ["Brüder", "братья", "pl"], ["Personen", "люди, человека", "pl"], ["Nummer", "номер", "f"]],
  p: [["Ich habe einen Computer.", "У меня есть компьютер."], ["Ich habe eine Frage.", "У меня вопрос."], ["Ich habe zwei Brüder.", "У меня два брата."], ["Es kostet drei Euro.", "Это стоит три евро."], ["Es kostet zehn Dollar.", "Это стоит десять долларов."], ["Ich habe ein Ticket.", "У меня есть билет."], ["Ich sehe zwei Personen.", "Я вижу двух человек."], ["Ich habe vier Tickets.", "У меня четыре билета."], ["Es ist Nummer neun.", "Это номер девять."]] },

{ n: 40, t: "Диктант: уроки 37–39", type: "review", from: [37, 38, 39],
  sum: "Повторяем mein и meine, прилагательные с es ist, числа и цены.",
  w: [], p: [] },

{ n: 41, t: "Практика: das ist и es ist", type: "review", from: [37, 38, 39],
  sum: "Das ist — когда показываем на кого-то или что-то. Es ist — с прилагательным и номером. Оба варианта правильные.",
  w: [],
  p: [["Das ist mein Haus.", "Это мой дом."], ["Das ist mein Auto.", "Это моя машина."], ["Es kostet acht Dollar.", "Это стоит восемь долларов."], ["Es ist sehr einfach.", "Это очень легко."], ["Es ist so interessant.", "Это так интересно."], ["Es kostet sechs Euro.", "Это стоит шесть евро."]] },

{ n: 42, t: "Большой диктант, часть 1", type: "review", from: "all",
  sum: "Повторяем слова и фразы всего уровня A00 вперемешку.",
  w: [], p: [] },

{ n: 43, t: "Большой диктант, часть 2", type: "review", from: "all",
  sum: "Продолжаем большой диктант. Новое слово — Basketball.",
  w: [["Basketball", "баскетбол", "m"]],
  p: [["Ich spiele Basketball.", "Я играю в баскетбол."], ["Ich mache es gern.", "Мне нравится это делать."]] },

{ n: 44, t: "Итоговая контрольная, часть 1", type: "test", from: "all",
  sum: "Итоговая проверка всего уровня A00. В идеале перевод звучит в голове сразу, без пауз.",
  w: [], p: [] },

{ n: 45, t: "Итоговая контрольная, часть 2", type: "test", from: "all",
  sum: "Итоговая контрольная, вторая часть.",
  w: [], p: [] },

{ n: 46, t: "Итоговая контрольная, часть 3", type: "test", from: "all",
  sum: "Итоговая контрольная, третья часть.",
  w: [], p: [] },

{ n: 47, t: "Итоговая контрольная, часть 4", type: "test", from: "all",
  sum: "Итоговая контрольная, четвёртая часть.",
  w: [], p: [["Ich lese langsam.", "Я медленно читаю."], ["Ich höre schlecht.", "Я плохо слышу."]] },

{ n: 48, t: "Итоговая контрольная, часть 5", type: "test", from: "all",
  sum: "Итоговая контрольная, пятая часть.",
  w: [], p: [["Sie haben drei Kinder.", "У них трое детей."], ["Das ist mein Hund.", "Это моя собака."]] },

{ n: 49, t: "Итоговая контрольная, часть 6", type: "test", from: "all",
  sum: "Итоговая контрольная, шестая часть.",
  w: [], p: [["Ich sage Guten Abend.", "Я говорю «добрый вечер»."], ["Wir verstehen es sehr gut.", "Мы понимаем это очень хорошо."]] },

{ n: 50, t: "Итоговая контрольная: вершина", type: "test", from: "all",
  sum: "Последний урок уровня A00. После него ты умеешь осознанно строить сотни простых фраз — и стоишь на вершине Брокена.",
  w: [], p: [["Ich lebe gern in Deutschland.", "Мне нравится жить в Германии."], ["Wir kommen aus der Ukraine.", "Мы из Украины."]] }
];
