/** 思维关卡 */
export const THINK_LEVELS = {
    observe: [
      { prompt: "找出不一样的那个", items: ["🍎", "🍎", "🍐", "🍎"], answer: 2 },
      { prompt: "哪一个和其他不同？", items: ["🐶", "🐱", "🐶", "🐶"], answer: 1 },
      { prompt: "找不同", items: ["⭐", "🌙", "⭐", "⭐"], answer: 1 },
      { prompt: "哪个形状不一样？", items: ["⬛", "⬛", "⬛", "🔺"], answer: 3 },
      { prompt: "找出单独的颜色", items: ["🔵", "🔴", "🔵", "🔵"], answer: 1 },
      { prompt: "哪个不是水果？", items: ["🍌", "🍇", "🚗", "🍉"], answer: 2 }
    ],
    classify: [
      {
        prompt: "把动物和食物分开：点一下物品，再点分类筐",
        items: ["🐶", "🍎", "🐱", "🍌"],
        baskets: [
          { name: "动物", accept: ["🐶", "🐱"] },
          { name: "食物", accept: ["🍎", "🍌"] }
        ]
      },
      {
        prompt: "天空的和地上的分一分",
        items: ["☁️", "🐦", "🌳", "🪨"],
        baskets: [
          { name: "天空", accept: ["☁️", "🐦"] },
          { name: "地上", accept: ["🌳", "🪨"] }
        ]
      },
      {
        prompt: "圆形和尖尖的分类",
        items: ["⚽", "🔺", "🟠", "⭐"],
        baskets: [
          { name: "圆圆", accept: ["⚽", "🟠"] },
          { name: "尖尖", accept: ["🔺", "⭐"] }
        ]
      }
    ],
    sort: [
      { prompt: "从小到大排队", items: ["🐭", "🐰", "🐘"], order: ["🐭", "🐰", "🐘"] },
      { prompt: "从少到多排队", items: ["•••", "•", "••"], order: ["•", "••", "•••"] },
      { prompt: "故事顺序：起床-吃饭-上学", items: ["🏫", "🛏️", "🍚"], order: ["🛏️", "🍚", "🏫"] },
      { prompt: "从矮到高", items: ["🏢", "🏠", "🛖"], order: ["🛖", "🏠", "🏢"] }
    ],
    pattern: [
      { prompt: "下一个是什么？🔴 🔵 🔴 🔵 ?", options: ["🔴", "🟢", "🟡"], answer: 0 },
      { prompt: "下一个是什么？⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ?", options: ["⭐", "🌙", "☀️"], answer: 0 },
      { prompt: "下一个是什么？🔺 ⬛ 🔺 ⬛ ?", options: ["🔺", "🔵", "🟩"], answer: 0 },
      { prompt: "下一个是什么？🐱 🐶 🐱 🐶 ?", options: ["🐱", "🐭", "🐸"], answer: 0 },
      { prompt: "下一个是什么？1 2 3 1 2 ?", options: ["3", "4", "1"], answer: 0 }
    ],
    express: [
      { emoji: "🌧️👧☂️", sentence: "下雨了，小朋友打着伞。" },
      { emoji: "🌅🏞️", sentence: "太阳升起来，山水真美。" },
      { emoji: "👨‍👩‍👧🏠", sentence: "我和爸爸妈妈在家里很开心。" },
      { emoji: "📚✏️🧒", sentence: "小朋友认真学习写字。" },
      { emoji: "🐱🐟", sentence: "小猫想吃小鱼。" }
    ]
  };
