const oneHeapRules = "Петя и Ваня по очереди играют с одной кучей, первым ходит Петя. За ход можно убрать 3 или 7 камней либо заменить количество камней на целую часть от деления на 4. Побеждает игрок, первым получивший не более 15 камней.";
const twoHeapRules = "Петя и Ваня по очереди играют с двумя кучами, первым ходит Петя. За ход можно добавить 4 камня в одну кучу либо удвоить одну кучу. Игра заканчивается, когда сумма достигает 133; начальная позиция — (17, S), 1 ≤ S ≤ 115.";

const templates = [
  {
    slug: "8-community-word-indexes", taskNumber: 8, title: "Номера слов в алфавитном списке",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 40,
    problem: "Все пятибуквенные слова из букв А, Е, Л, П, Р, Ь записаны в алфавитном порядке и пронумерованы с 1. Определите количество слов с чётным номером, которые не начинаются с Р или Ь и содержат не менее двух букв Л.",
    code: `from itertools import product

answer = []
for number, letters in enumerate(product('АЕЛПРЬ', repeat=5), start=1):
    word = ''.join(letters)
    if number % 2 == 0 and word[0] not in 'РЬ' and word.count('Л') >= 2:
        answer.append(number)
print(len(answer))`,
  },
  {
    slug: "8-community-base7-numbers", taskNumber: 8, title: "Числа в заданной системе счисления",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 41,
    problem: "Определите количество пятизначных чисел в семеричной системе счисления, в записи которых цифра 1 встречается не более двух раз, а цифра 0 встречается ровно один раз. Запись числа не может начинаться с нуля.",
    code: `from itertools import product

answer = 0
for digits in product('0123456', repeat=5):
    number = ''.join(digits)
    if number[0] != '0' and number.count('1') <= 2 and number.count('0') == 1:
        answer += 1
print(answer)`,
  },
  {
    slug: "8-community-name-permutations", taskNumber: 8, title: "Перестановки букв без повторений",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 42,
    problem: "Артём составляет пятибуквенные слова перестановкой всех букв имени АРТЁМ, используя каждую букву ровно один раз. Слово не должно одновременно начинаться и заканчиваться гласной буквой А или Ё. Сколько различных слов возможно?",
    code: `from itertools import permutations

answer = 0
for letters in permutations('АРТЁМ'):
    if not (letters[0] in 'АЁ' and letters[-1] in 'АЁ'):
        answer += 1
print(answer)`,
  },
  {
    slug: "10-community-broadcast-address", taskNumber: 10, title: "Широковещательный адрес сети",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 0,
    problem: "Сеть содержит узел 154.141.198.190 и задана маской 255.255.192.0. Найдите широковещательный IP-адрес этой сети и в ответе укажите сумму десятичных значений его четырёх октетов.",
    code: `from ipaddress import ip_network

network = ip_network('154.141.198.190/255.255.192.0', strict=False)
broadcast = network.broadcast_address
print(sum(int(octet) for octet in str(broadcast).split('.')))`,
  },
  {
    slug: "10-community-largest-host", taskNumber: 10, title: "Наибольший адрес узла",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 1,
    problem: "Сеть содержит узел 146.180.173.153 и задана маской 255.192.0.0. Найдите наибольший IP-адрес, который можно назначить компьютеру в этой сети, и запишите четыре октета подряд без точек.",
    code: `from ipaddress import ip_network

network = ip_network('146.180.173.153/255.192.0.0', strict=False)
largest_host = network.broadcast_address - 1
print(str(largest_host).replace('.', ''))`,
  },
  {
    slug: "10-community-even-one-bits", taskNumber: 10, title: "Адреса с чётным числом единиц",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 2,
    problem: "Сеть задана адресом 172.16.96.0 и маской 255.255.224.0. Определите количество IP-адресов этой сети, в полной 32-битной двоичной записи которых число единиц чётно.",
    code: `from ipaddress import ip_network

network = ip_network('172.16.96.0/255.255.224.0')
print(sum(f'{int(ip):032b}'.count('1') % 2 == 0 for ip in network))`,
  },
  {
    slug: "10-community-count-masks", taskNumber: 10, title: "Количество подходящих масок",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 3,
    problem: "Неизвестная сеть содержит узел 192.214.116.184. В двоичной записи адреса сети должно быть положительное число единиц, кратное 5; адрес сети не может состоять только из нулей. Сколько различных масок задают такую сеть?",
    code: `from ipaddress import ip_network

answer = 0
for prefix in range(33):
    network = ip_network(f'192.214.116.184/{prefix}', strict=False)
    ones = f'{int(network.network_address):032b}'.count('1')
    if ones > 0 and ones % 5 == 0:
        answer += 1
print(answer)`,
  },
  {
    slug: "10-community-free-addresses", taskNumber: 10, title: "Свободные адреса для устройств",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 4,
    problem: "Узел 95.24.20.25 входит в сеть с маской 255.255.252.0. Помимо него уже подключены 3 ноутбука, 4 телефона, 2 планшета и один умный горшок. Сколько дополнительных устройств ещё можно подключить, исключая адрес сети и широковещательный адрес?",
    code: `from ipaddress import ip_network

network = ip_network('95.24.20.25/255.255.252.0', strict=False)
already_connected = 1 + 3 + 4 + 2 + 1
print(network.num_addresses - 2 - already_connected)`,
  },
  {
    slug: "13-community-swap-last-digits", taskNumber: 13, title: "Команда перестановки цифр",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 40,
    problem: "Исполнитель начинает с числа 100 и должен получить 141. Команда A прибавляет 1. Команда B разрешена, когда цифра десятков меньше цифры единиц, и меняет две последние цифры местами. Определите количество программ, переводящих 100 в 141.",
    code: `from functools import lru_cache

@lru_cache(None)
def f(x):
    if x == 141:
        return 1
    if x > 141:
        return 0
    result = f(x + 1)
    tens, ones = x // 10 % 10, x % 10
    if tens < ones:
        result += f(x - tens * 10 - ones + ones * 10 + tens)
    return result

print(f(100))`,
  },
  {
    slug: "14-community-unknown-digit-base29", taskNumber: 14, title: "Неизвестная цифра в основании 29",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 40,
    problem: "Числа 463x7921 и 8241x153 записаны в системе счисления с основанием 29, где x — неизвестная цифра. Найдите наименьшее x, при котором сумма чисел делится на 28, и выведите частное от деления суммы на 28 в десятичной системе.",
    code: `from string import printable

for x in printable[:29]:
    value = int(f'463{x}7921', 29) + int(f'8241{x}153', 29)
    if value % 28 == 0:
        print(value // 28)
        break`,
  },
  {
    slug: "14-community-largest-x-sixty-zeroes", taskNumber: 14, title: "Наибольшее x при заданном числе нулей",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 41,
    problem: "Значение выражения 9·11²¹⁰ + 8·11¹⁵⁰ − x записали в системе счисления с основанием 11. Найдите наибольшее положительное x, не превышающее 3000, при котором запись содержит ровно 60 нулей.",
    code: `for x in range(3000, 0, -1):
    value = 9 * 11**210 + 8 * 11**150 - x
    zeroes = 0
    while value:
        zeroes += value % 11 == 0
        value //= 11
    if zeroes == 60:
        print(x)
        break`,
  },
  {
    slug: "14-community-smallest-x-six-zeroes", taskNumber: 14, title: "Наименьшее x при заданном числе нулей",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 42,
    problem: "Значение выражения 3·27⁹ + 2·27⁶ + 27³ − x записали в системе счисления с основанием 27. Найдите наименьшее положительное x, не превышающее 27 000, при котором запись содержит ровно 6 нулей.",
    code: `for x in range(1, 27001):
    value = 3 * 27**9 + 2 * 27**6 + 27**3 - x
    zeroes = 0
    while value:
        zeroes += value % 27 == 0
        value //= 27
    if zeroes == 6:
        print(x)
        break`,
  },
  {
    slug: "14-community-max-zeroes-base4", taskNumber: 14, title: "Максимальное количество нулей",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 43,
    problem: "Значение выражения 4²¹⁰ + 4¹¹⁰ − x записали в четверичной системе счисления. Среди положительных x, не превышающих 3000, найдите наименьшее x, при котором в записи выражения получается максимально возможное число нулей.",
    code: `best_x = 0
best_zeroes = -1
for x in range(1, 3001):
    value = 4**210 + 4**110 - x
    zeroes = 0
    while value:
        zeroes += value % 4 == 0
        value //= 4
    if zeroes > best_zeroes:
        best_x, best_zeroes = x, zeroes
print(best_x)`,
  },
  {
    slug: "15-community-two-variables", taskNumber: 15, title: "Две целочисленные переменные",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 40,
    problem: "Найдите наибольшее целое неотрицательное A, при котором выражение (x + y ≤ 27) ∨ (y ≤ x − 1) ∨ (y ≥ A) истинно при любых целых положительных значениях x и y.",
    code: `def f(x, y, A):
    return (x + y <= 27) or (y <= x - 1) or (y >= A)

print(max(A for A in range(1000)
          if all(f(x, y, A) for x in range(1, 100) for y in range(1, 100))))`,
  },
  {
    slug: "15-community-three-intervals", taskNumber: 15, title: "Три заданных отрезка",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 41,
    problem: "На прямой даны B = [32; 425], C = [130; 480] и D = [290; 575]. Найдите наибольшую длину отрезка A, при которой выражение ((x ∈ C) → ¬(x ∈ D)) ∧ (x ∈ A) ∧ ¬(x ∈ B) ложно при каждом действительном x.",
    code: `def f(x, a1, a2):
    B = 32 <= x <= 425
    C = 130 <= x <= 480
    D = 290 <= x <= 575
    A = a1 <= x <= a2
    return (C <= (not D)) and A and not B

points = [p for x in (32, 425, 130, 480, 290, 575) for p in (x-0.01, x, x+0.01)]
lengths = [a2-a1 for a1 in points for a2 in points
           if a2 > a1 and all(not f(x, a1, a2) for x in points)]
print(max(lengths))`,
  },
  {
    slug: "15-community-nested-intervals", taskNumber: 15, title: "Отрезки и вложенные импликации",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 42,
    problem: "На прямой даны B = [290; 750] и C = [135; 675]. Найдите наименьшую длину отрезка A, при которой формула (¬(x ∈ B) ∧ (x ∈ C)) → ((¬(x ∈ A) ∧ (x ∈ C)) → (x ∈ B)) истинна при любом действительном x.",
    code: `def f(x, a1, a2):
    B = 290 <= x <= 750
    C = 135 <= x <= 675
    A = a1 <= x <= a2
    return (not B and C) <= ((not A and C) <= B)

points = [p for x in (290, 750, 135, 675) for p in (x-0.01, x, x+0.01)]
lengths = [a2-a1 for a1 in points for a2 in points
           if a2 > a1 and all(f(x, a1, a2) for x in points)]
print(min(lengths))`,
  },
  {
    slug: "15-community-divisibility-with-interval", taskNumber: 15, title: "ДЕЛ и заданный отрезок",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 43,
    problem: "Пусть ДЕЛ(n, m) означает делимость n на m, а B = [70; 90]. Найдите наибольшее натуральное A, при котором ДЕЛ(x, A) ∨ ((x ∈ B) → ¬ДЕЛ(x, 22)) истинно при любом целом положительном x.",
    code: `def f(x, A):
    B = 70 <= x <= 90
    return x % A == 0 or (B <= (x % 22 != 0))

print(max(A for A in range(1, 1000)
          if all(f(x, A) for x in range(1, 10000))))`,
  },
  {
    slug: "15-community-divisibility", taskNumber: 15, title: "Вложенные условия ДЕЛ",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 44,
    problem: "Пусть ДЕЛ(n, m) означает, что натуральное n делится на натуральное m. Найдите наибольшее натуральное A, при котором ДЕЛ(x, 33) → (¬ДЕЛ(x, A) → ¬ДЕЛ(x, 242)) истинно для любого положительного целого x.",
    code: `def f(x, A):
    return (x % 33 == 0) <= ((x % A != 0) <= (x % 242 != 0))

print(max(A for A in range(1, 10000)
          if all(f(x, A) for x in range(1, 100000))))`,
  },
  {
    slug: "16-community-functions-f-and-g", taskNumber: 16, title: "Функция F через рекурсивную G",
    recognition: "", explanation: "", note: "", status: "published", sortOrder: 40,
    problem: "Функция G задана так: G(n) = 2(n + 1) при n ≤ 25 и G(n) = G(n − 4) + n при n > 25. Функция F задана равенством F(n) = G(n − 1) − G(n − 5). Вычислите F(150774).",
    code: `from functools import lru_cache

@lru_cache(None)
def g(n):
    if n <= 25:
        return 2 * (n + 1)
    return g(n - 4) + n

def f(n):
    return g(n - 1) - g(n - 5)

print(f(150774))`,
  },
  ...[19, 20, 21].map((taskNumber, index) => ({
    slug: `${taskNumber}-community-one-heap-decrease`, taskNumber,
    title: "Одна куча: −3, −7, ÷4", recognition: "", explanation: "", note: "",
    status: "published", sortOrder: 50 + index,
    problem: `${oneHeapRules} ${taskNumber === 19
      ? "Найдите минимальное S, при котором Петя не выигрывает за один ход, а после любого его хода Ваня выигрывает первым ходом."
      : taskNumber === 20
        ? "Найдите два наименьших S, при которых Петя не выигрывает первым ходом, но гарантированно выигрывает вторым ходом."
        : "Найдите минимальное S, при котором Ваня выигрывает первым или вторым ходом, но не может гарантировать победу своим первым ходом."}`,
    code: `def f(s, moves):
    if s <= 15:
        return moves % 2 == 0
    if moves == 0:
        return False
    results = [f(s - 3, moves - 1), f(s - 7, moves - 1), f(s // 4, moves - 1)]
    return any(results) if (moves - 1) % 2 == 0 else all(results)

print([s for s in range(16, 1000) if ${taskNumber === 19 ? "f(s, 2)" : taskNumber === 20 ? "not f(s, 1) and f(s, 3)" : "not f(s, 2) and f(s, 4)"}])`,
  })),
  ...[19, 20, 21].map((taskNumber, index) => ({
    slug: `${taskNumber}-community-two-heaps`, taskNumber,
    title: "Две кучи: +4 и ×2", recognition: "", explanation: "", note: "",
    status: "published", sortOrder: 60 + index,
    problem: `${twoHeapRules} ${taskNumber === 19
      ? "Найдите минимальное S, при котором Петя не выигрывает за один ход, а после любого его хода Ваня выигрывает первым ходом."
      : taskNumber === 20
        ? "Найдите два наименьших S, при которых Петя не выигрывает первым ходом, но гарантированно выигрывает вторым ходом."
        : "Найдите минимальное S, при котором Ваня выигрывает первым или вторым ходом, но не может гарантировать победу своим первым ходом."}`,
    code: `def f(a, b, moves):
    if a + b >= 133:
        return moves % 2 == 0
    if moves == 0:
        return False
    results = [f(a + 4, b, moves - 1), f(a * 2, b, moves - 1),
               f(a, b + 4, moves - 1), f(a, b * 2, moves - 1)]
    return any(results) if (moves - 1) % 2 == 0 else all(results)

print([s for s in range(1, 116) if ${taskNumber === 19 ? "f(17, s, 2)" : taskNumber === 20 ? "not f(17, s, 1) and f(17, s, 3)" : "not f(17, s, 2) and f(17, s, 4)"}])`,
  })),
];

export default templates;
