import random

# 词库文件名
WORD_FILE = "words.txt"

def load_words(filename):
    """从文件中加载词库，每行一个词"""
    with open(filename, "r", encoding="utf-8") as f:
        words = [line.strip() for line in f if line.strip()]
    return words

def main():
    words = load_words(WORD_FILE)
    if not words:
        print("⚠️ 词库为空，请在 words.txt 中添加一些词！")
        return

    # 随机选取一个词
    random_word = random.choice(words)
    print(f"🎯 随机词语：{random_word}")

if __name__ == "__main__":
    main()
