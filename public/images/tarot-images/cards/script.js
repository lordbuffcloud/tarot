const tarotDeck = [
  {
    name: "愚者（The Fool）",
    upright: "冒險、自由、新的開始、天真無邪。",
    reversed: "愚蠢、魯莽、逃避、猶豫不決。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg",
  },
  {
    name: "魔術師（The Magician）",
    upright: "創造力、資源運用、行動力、掌控能力。",
    reversed: "欺騙、浪費潛能、操控他人、技巧不當。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
  },
  {
    name: "女祭司（The High Priestess）",
    upright: "直覺、潛意識、神秘、內在智慧。",
    reversed: "內心混亂、疏離、秘密、壓抑。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/88/RWS_Tarot_02_High_Priestess.jpg",
  },
  {
    name: "女皇（The Empress）",
    upright: "豐盛、母性、創造、美感。",
    reversed: "依賴、停滯、不孕、創造力阻礙。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d2/RWS_Tarot_03_Empress.jpg",
  },
  {
    name: "皇帝（The Emperor）",
    upright: "結構、權威、穩定、父性力量。",
    reversed: "控制、固執、濫用權力、冷漠。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/c3/RWS_Tarot_04_Emperor.jpg",
  },
  {
    name: "教皇（The Hierophant）",
    upright: "傳統、信仰、教育、精神指導。",
    reversed: "教條、反叛、不合群、僵化思想。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/8d/RWS_Tarot_05_Hierophant.jpg",
  },
  {
    name: "戀人（The Lovers）",
    upright: "愛情、選擇、親密、價值觀一致。",
    reversed: "分離、誘惑、誤判、關係不和諧。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
  },
  {
    name: "戰車（The Chariot）",
    upright: "勝利、控制、意志力、突破阻礙。",
    reversed: "失控、固執、方向錯誤、情緒化。",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3a/The_Chariot.jpg",
  },
  {
    name: "力量（Strength）",
    upright: "勇氣、耐心、內在力量、同理心。",
    reversed: "自卑、憤怒、焦躁、懦弱。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
  },
  {
    name: "隱者（The Hermit）",
    upright: "內省、指引、尋找真理、獨處。",
    reversed: "孤立、閉塞、逃避現實、迷失方向。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/4d/RWS_Tarot_09_Hermit.jpg",
  },
  {
    name: "命運之輪（Wheel of Fortune）",
    upright: "命運轉變、機會、循環、幸運。",
    reversed: "挫折、延遲、不確定、逆境。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  },
  {
    name: "正義（Justice）",
    upright: "公平、法律、真相、因果。",
    reversed: "不公、不負責、偏見、誤判。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/e/e0/RWS_Tarot_11_Justice.jpg",
  },
  {
    name: "吊人（The Hanged Man）",
    upright: "犧牲、等待、逆向思考、轉化。",
    reversed: "停滯、逃避改變、自我受限、拖延。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  },
  {
    name: "死神（Death）",
    upright: "結束、新開始、轉化、重生。",
    reversed: "抗拒改變、停滯、害怕失去。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/d7/RWS_Tarot_13_Death.jpg",
  },
  {
    name: "節制（Temperance）",
    upright: "平衡、和諧、調和、節制。",
    reversed: "極端、衝突、不耐、失衡。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/f8/RWS_Tarot_14_Temperance.jpg",
  },
  {
    name: "惡魔（The Devil）",
    upright: "束縛、慾望、誘惑、依賴。",
    reversed: "解脫、自我掌控、擺脫成癮。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/55/RWS_Tarot_15_Devil.jpg",
  },
  {
    name: "塔（The Tower）",
    upright: "突然改變、災難、打破舊有模式。",
    reversed: "抗拒改變、延遲災難、內在崩潰。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
  },
  {
    name: "星星（The Star）",
    upright: "希望、療癒、靈感、指引。",
    reversed: "絕望、迷失、不信任、缺乏信念。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_17_Star.jpg",
  },
  {
    name: "月亮（The Moon）",
    upright: "潛意識、幻象、直覺、不確定性。",
    reversed: "真相揭露、混亂、情緒不穩。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/7f/RWS_Tarot_18_Moon.jpg",
  },
  {
    name: "太陽（The Sun）",
    upright: "快樂、成功、正能量、成就。",
    reversed: "延遲的快樂、懷疑、自負。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/1/17/RWS_Tarot_19_Sun.jpg",
  },
  {
    name: "審判（Judgement）",
    upright: "甦醒、救贖、內在審視、新機會。",
    reversed: "逃避責任、自我否定、延遲轉變。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/d/dd/RWS_Tarot_20_Judgement.jpg",
  },
  {
    name: "世界（The World）",
    upright: "完成、整合、圓滿、目標達成。",
    reversed: "未竟之事、缺乏結束、停滯不前。",
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/ff/RWS_Tarot_21_World.jpg",
  },
];

document.getElementById("draw-button").addEventListener("click", () => {
  // 隨機選一張牌
  const card = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];

  // 隨機決定正位或逆位
  const isReversed = Math.random() < 0.5;

  // 顯示圖片
  const cardImage = document.getElementById("tarot-card");
  cardImage.src = card.image;
  cardImage.style.transform = isReversed ? "rotate(180deg)" : "rotate(0deg)";

  // 顯示牌義
  document.getElementById("card-name").textContent = card.name;
  document.getElementById("card-orientation").textContent = isReversed
    ? "逆位"
    : "正位";
  document.getElementById("card-description").textContent = isReversed
    ? card.reversed
    : card.upright;

  // 顯示說明區
  document.getElementById("card-info").classList.remove("hidden");
});
