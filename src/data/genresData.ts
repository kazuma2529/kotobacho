import { Genre } from '../types';
import { ALL_WORDS } from './wordsData';

interface GenreDefinition {
  id: number;
  name: string;
  titleJa: string;
  titleEn: string;
  description: string;
  icon: string;
}

const RAW_GENRES: GenreDefinition[] = [
  { id: 1, name: '虫・昆虫', titleJa: '虫・昆虫', titleEn: 'Insects & Bugs', description: '身近な虫や昆虫の名前を学ぶ', icon: '🪲' },
  { id: 2, name: '魚・海の生き物', titleJa: '魚・海の生き物', titleEn: 'Fish & Sea Creatures', description: '魚介類や海洋生物の英語', icon: '🐟' },
  { id: 3, name: '動物', titleJa: '動物', titleEn: 'Animals', description: '身近な動物から野生動物まで', icon: '🦁' },
  { id: 4, name: '植物・草花', titleJa: '植物・草花', titleEn: 'Plants & Flowers', description: '花や草木、植物のパーツ', icon: '🌷' },
  { id: 5, name: '野菜', titleJa: '野菜', titleEn: 'Vegetables', description: '日常的に食べる野菜の英語', icon: '🥬' },
  { id: 6, name: '果物', titleJa: '果物', titleEn: 'Fruits', description: '身近なフルーツ・果実の表現', icon: '🍎' },
  { id: 7, name: '香辛料・調味料', titleJa: '香辛料・調味料', titleEn: 'Spices & Seasonings', description: '料理に欠かせない調味料・スパイス', icon: '🧂' },
  { id: 8, name: '料理・食品', titleJa: '料理・食品', titleEn: 'Dishes & Food', description: '食べ物や和食・洋食の英単語', icon: '🍝' },
  { id: 9, name: '飲み物', titleJa: '飲み物', titleEn: 'Drinks & Beverages', description: 'ドリンク・お茶・お酒の種類', icon: '☕' },
  { id: 10, name: '食器', titleJa: '食器', titleEn: 'Tableware & Cutlery', description: 'お皿やグラス・カトラリー', icon: '🍽️' },
  { id: 11, name: '調理器具', titleJa: '調理器具', titleEn: 'Cookware & Utensils', description: '鍋・フライパン・包丁などの道具', icon: '🍳' },
  { id: 12, name: 'キッチン用品', titleJa: 'キッチン用品', titleEn: 'Kitchen Supplies', description: 'ラップ・スポンジ・キッチン雑貨', icon: '🧽' },
  { id: 13, name: '家具', titleJa: '家具', titleEn: 'Furniture', description: '机・椅子・ベッドなどの家具', icon: '🛋️' },
  { id: 14, name: '家電製品', titleJa: '家電製品', titleEn: 'Home Appliances', description: '家電や電子機器の英単語', icon: '💻' },
  { id: 15, name: '掃除・洗濯用品', titleJa: '掃除・洗濯用品', titleEn: 'Cleaning & Laundry', description: '日々の清掃・洗濯グッズ', icon: '🧹' },
  { id: 16, name: '日用品・消耗品', titleJa: '日用品・消耗品', titleEn: 'Daily Goods & Consumables', description: 'ティッシュや衛生用品などの消耗品', icon: '🧻' },
  { id: 17, name: '文房具', titleJa: '文房具', titleEn: 'Stationery', description: 'ペン・ハサミ・ノートなどの文具', icon: '✏️' },
  { id: 18, name: '衣類', titleJa: '衣類', titleEn: 'Clothing & Apparel', description: '洋服・下着・和服の単語', icon: '👕' },
  { id: 19, name: '靴・履物', titleJa: '靴・履物', titleEn: 'Footwear & Shoes', description: 'スニーカー・ブーツ・サンダル', icon: '👟' },
  { id: 20, name: 'アクセサリー・装飾品', titleJa: 'アクセサリー・装飾品', titleEn: 'Accessories & Jewelry', description: '指輪・バッグ・眼鏡・装飾品', icon: '💍' },
  { id: 21, name: '化粧品・美容用品', titleJa: '化粧品・美容用品', titleEn: 'Cosmetics & Beauty', description: 'スキンケア・コスメ・美容道具', icon: '💄' },
  { id: 22, name: '身体の部位', titleJa: '身体の部位', titleEn: 'Body Parts', description: '頭から足先までの体の部位', icon: '🫀' },
  { id: 23, name: '病気・症状', titleJa: '病気・症状', titleEn: 'Illnesses & Symptoms', description: '風邪や痛み・体調不良・疾患の表現', icon: '🤒' },
  { id: 24, name: '職業', titleJa: '職業', titleEn: 'Occupations & Jobs', description: '多様な仕事・職種の英単語', icon: '👨‍⚕️' },
  { id: 25, name: '学問・研究分野', titleJa: '学問・研究分野', titleEn: 'Academic Fields', description: '数学・歴史・心理学などの学問', icon: '📚' },
  { id: 26, name: '学校・教育施設', titleJa: '学校・教育施設', titleEn: 'School Facilities', description: '学校の施設や教室の英語', icon: '🏫' },
  { id: 27, name: '店舗・商業施設', titleJa: '店舗・商業施設', titleEn: 'Shops & Commercial Stores', description: 'お店やスーパー・商業施設', icon: '🏪' },
  { id: 28, name: '公共施設', titleJa: '公共施設', titleEn: 'Public Facilities', description: '役所・病院・図書館などの公共施設', icon: '🏛️' },
  { id: 29, name: '交通機関', titleJa: '交通機関', titleEn: 'Transportation', description: '電車・バス・飛行機などの乗り物', icon: '🚌' },
  { id: 30, name: '道路・街中の設備', titleJa: '道路・街中の設備', titleEn: 'Roads & Street Facilities', description: '信号・歩道・ポストなどの街の設備', icon: '🚥' },
  { id: 31, name: '建物・住宅設備', titleJa: '建物・住宅設備', titleEn: 'Buildings & Home Fixtures', description: '家・マンション・住宅の設備', icon: '🏢' },
  { id: 32, name: '工具・作業道具', titleJa: '工具・作業道具', titleEn: 'Tools & Hardware', description: 'ドライバーや金づちなどの工具', icon: '🔧' },
  { id: 33, name: 'スポーツ・運動用具', titleJa: 'スポーツ・運動用具', titleEn: 'Sports & Fitness Gear', description: 'ボールやラケットなどの用具', icon: '⚽' },
  { id: 34, name: '楽器', titleJa: '楽器', titleEn: 'Musical Instruments', description: 'ピアノ・ギター・吹奏楽器', icon: '🎻' },
  { id: 35, name: '天気・自然現象', titleJa: '天気・自然現象', titleEn: 'Weather & Natural Phenomena', description: '天候や気象・自然現象', icon: '☀️' },
  { id: 36, name: '星座・天体', titleJa: '星座・天体', titleEn: 'Constellations & Celestial Bodies', description: '星や星座・宇宙の単語', icon: '🌌' },
  { id: 37, name: '地形・自然環境', titleJa: '地形・自然環境', titleEn: 'Landforms & Environments', description: '山・海・川・地形の英語', icon: '⛰️' },
  { id: 38, name: '企業・ブランド名', titleJa: '企業・ブランド名', titleEn: 'Companies & Brands', description: '有名企業・ブランドの英語表記', icon: '🏷️' },
  { id: 39, name: '顔のパーツ', titleJa: '顔のパーツ', titleEn: 'Facial Features', description: '目・鼻・口・顔の細かな部位', icon: '👁️' },
  { id: 40, name: '算数（計算・図形）', titleJa: '算数（計算・図形）', titleEn: 'Math, Shapes & Arithmetic', description: '計算式や図形・数学の基本表現', icon: '📐' },
  { id: 41, name: '公園器具', titleJa: '公園器具', titleEn: 'Park Equipment', description: 'ブランコや滑り台など公園の遊具・設備', icon: '🛝' },
  { id: 42, name: '英語授業用語', titleJa: '英語授業用語', titleEn: 'English Classroom & Grammar Terms', description: '品詞・文法・時制・発音・英語授業で使う用語', icon: '📖' },
  { id: 43, name: '色・色彩', titleJa: '色・色彩', titleEn: 'Colors & Hues', description: '色の名前やニュアンスの表現', icon: '🎨' },
  { id: 44, name: '形容詞から作られる名詞', titleJa: '形容詞から作られる名詞', titleEn: 'Adjective–noun word families', description: '形容詞から派生する抽象名詞・性質を表す名詞', icon: '🔤' },
  { id: 45, name: 'エロ用語', titleJa: 'エロ用語', titleEn: 'Erotic & Sexual Vocabulary', description: '性に関する一般語・医学語・俗語・表現', icon: '💋' },
  { id: 46, name: '宗教', titleJa: '宗教', titleEn: 'Religion & Faith', description: '宗教・信仰・儀式・宗教文化に関する表現', icon: '🛐' },
  { id: 47, name: '株式投資・資産運用', titleJa: '株式投資・資産運用', titleEn: 'Stock Investing & Wealth Management', description: '株式・金融商品・市場・資産形成に関する表現', icon: '📈' },
];
export const GENRES: Genre[] = RAW_GENRES.map((g) => ({
  ...g,
  count: ALL_WORDS.filter((w) => w.genreId === g.id).length,
}));
