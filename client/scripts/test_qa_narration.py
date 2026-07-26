"""qa_narration 解析逻辑的回归测试。

跑法: python3 scripts/test_qa_narration.py
只用标准库 unittest, 不引入新依赖。

覆盖三类历史缺陷:
1. extract_numbers 把「第一个数」「合在一起」的「一」当成运算数字(假警告)
2. 场景配置正则只认 lineId 在 sectionId 之前的写法(漏解析整份文件)
3. 口播行解析被文案里的 ] 截断(如「记作 [fx, fy]」)
"""
import importlib.util
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).parent
spec = importlib.util.spec_from_file_location('qa', SCRIPTS / 'qa_narration.py')
qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qa)


class TestExtractNumbers(unittest.TestCase):
    """只认真正参与运算的数字, 不认量词/副词里的「一」。"""

    def test_ignores_quantifier_yi(self):
        for text in [
            '首先，我们来认识加法。加法就是把两堆东西合在一起。',
            '看！蓝色方块是第一个数，绿色方块是第二个数。',
            '这意味着乘以一个复数，相当于旋转加缩放！',
            '第一步，我们统一分母。',
        ]:
            self.assertEqual(qa.extract_numbers(text), [], msg=text)

    def test_arabic_numbers(self):
        self.assertEqual(qa.extract_numbers('看这些方块，开始有7个。现在我们要拿走5个。'), [5, 7])
        self.assertEqual(qa.extract_numbers('比如12除以3，就是把12个方块平均分成3组。'), [3, 12])
        self.assertEqual(qa.extract_numbers('旋转90度再旋转90度，就是旋转180度。'), [90, 180])

    def test_chinese_numerals_with_measure_word(self):
        self.assertEqual(qa.extract_numbers('把三个苹果分成两组。'), [2, 3])
        self.assertEqual(qa.extract_numbers('两个复数相乘，模相乘，辐角相加。'), [2])

    def test_chinese_numerals_after_operator(self):
        self.assertEqual(qa.extract_numbers('十二除以四等于三。'), [3, 4, 12])

    def test_fraction_not_split(self):
        # 「四分之一」是一个分数, 不该拆出 4 和 1; 后半句的 4/3/12 才是运算数字
        self.assertEqual(qa.extract_numbers('比如四分之一加三分之二，公共分母是4乘3等于12。'), [3, 4, 12])


class TestParseScenes(unittest.TestCase):
    """两种字段顺序都要认。"""

    SCENES_DIR = SCRIPTS.parent / 'src/components/NarrationPresenter'

    def _count(self, filename):
        return len(qa.parse_typescript_scenes(self.SCENES_DIR / filename))

    def test_line_id_first(self):
        self.assertEqual(self._count('eulerLineScenes.ts'), 17)

    def test_section_id_first(self):
        # laplaceScenes / permutationCombinationScenes 是 sectionId 在前
        self.assertEqual(self._count('laplaceScenes.ts'), 25)
        self.assertEqual(self._count('permutationCombinationScenes.ts'), 23)

    def _find(self, filename, line_id):
        scenes = qa.parse_typescript_scenes(self.SCENES_DIR / filename)
        return next(s for s in scenes if s['line_id'] == line_id)

    def test_params_after_sibling_objects(self):
        # sub-2 的 lineState 里 params 后面还有 show/highlight/annotation 兄弟对象,
        # 旧正则只能跨一层嵌套, 会误报「缺少 params」
        scene = self._find('basicArithmeticScenes.ts', 'sub-2')
        self.assertEqual(scene['params']['num1'], 7)
        self.assertEqual(scene['params']['num2'], 5)
        self.assertEqual(scene['params']['operation'], 'subtraction')

    def test_nested_params_recognized(self):
        # complex 的 params 是 { z1: { a, b }, z2: { a, b } }, 没有 num1/num2
        # 但 has_params 必须为真, 否则会误报「缺少 params」
        scene = self._find('complexScenes.ts', 'multiplication-1')
        self.assertTrue(scene['has_params'])
        self.assertNotIn('num1', scene['params'])


class TestParseScript(unittest.TestCase):
    """口播行数不能被文案里的方括号截断。"""

    SCRIPTS_DIR = SCRIPTS.parent / 'src/narrations/scripts'

    def test_bracket_in_text_does_not_truncate(self):
        # partial-derivative 的 grad-1 含「记作 [fx, fy]」, 曾使 gradient 段少 2 行
        lines = qa.parse_typescript_script(self.SCRIPTS_DIR / 'partial-derivative.ts')
        self.assertEqual(len(lines), 16)
        grad = [x for x in lines if x['section_id'] == 'gradient']
        self.assertEqual([x['line_id'] for x in grad], ['grad-1', 'grad-2', 'grad-3'])

    def test_plain_script(self):
        self.assertEqual(len(qa.parse_typescript_script(self.SCRIPTS_DIR / 'euler-line.ts')), 17)


if __name__ == '__main__':
    unittest.main(verbosity=2)
