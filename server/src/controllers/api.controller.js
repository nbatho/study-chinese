// Mock data for learning Chinese
const MOCK_WORDS = [
  { id: 1, hanzi: '你好', pinyin: 'nǐ hǎo', translation: 'Hello' },
  { id: 2, hanzi: '谢谢', pinyin: 'xièxie', translation: 'Thank you' },
  { id: 3, hanzi: '再见', pinyin: 'zàijiàn', translation: 'Goodbye' },
  { id: 4, hanzi: '学习', pinyin: 'xuéxí', translation: 'To study' },
  { id: 5, hanzi: '中文', pinyin: 'Zhōngwén', translation: 'Chinese language' }
];

/**
 * Get sample Chinese words list
 */
export const getWordsList = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      results: MOCK_WORDS.length,
      data: {
        words: MOCK_WORDS
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get profile info of the authenticated user
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user was populated by checkAuth middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};
